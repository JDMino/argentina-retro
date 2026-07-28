import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contenido } from './entities/contenido.entity';
import { ContenidoEtiqueta } from './entities/contenido-etiqueta.entity';
import { Imagen } from '../multimedia/entities/imagen.entity';
import { Video } from '../multimedia/entities/video.entity';
import { CreateContenidoDto } from './dto/create-contenido.dto';
import { UpdateContenidoDto } from './dto/update-contenido.dto';
import { FindContenidoQueryDto } from './dto/find-contenido-query.dto';
import { DecadasService } from '../decadas/decadas.service';
import { CategoriasService } from '../categorias/categorias.service';

// TypeORM 1.0 eliminó la sintaxis de array de strings para `relations`;
// ahora es obligatorio el formato objeto/anidado.
const RELACIONES_DEFAULT = {
  decada: true,
  categoria: true,
  imagenes: true,
  videos: true,
  contenidoEtiquetas: { etiqueta: true },
} as const;

@Injectable()
export class ContenidoService {
  constructor(
    @InjectRepository(Contenido)
    private readonly contenidoRepository: Repository<Contenido>,
    @InjectRepository(ContenidoEtiqueta)
    private readonly contenidoEtiquetaRepository: Repository<ContenidoEtiqueta>,
    private readonly decadasService: DecadasService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async create(dto: CreateContenidoDto): Promise<Contenido> {
    await this.assertSlugDisponible(dto.slug);
    await this.decadasService.findOne(dto.decadaId);
    await this.categoriasService.findOne(dto.categoriaId);

    const { etiquetaIds, imagenes, videos, ...resto } = dto;

    const contenido = this.contenidoRepository.create({
      ...resto,
      imagenes: imagenes ?? [],
      videos: videos ?? [],
    });

    const guardado = await this.contenidoRepository.save(contenido);

    if (etiquetaIds?.length) {
      await this.asociarEtiquetas(guardado.id, etiquetaIds);
    }

    return this.findOne(guardado.id);
  }

  async findAll(query: FindContenidoQueryDto) {
    const pagina = query.pagina ?? 1;
    const limite = query.limite ?? 20;

    // Query builder (no `where` plano) porque el filtro por etiqueta necesita
    // un join a `contenido_etiquetas` y la búsqueda de texto necesita ILIKE
    // combinado con el resto de los filtros exactos.
    const qb = this.contenidoRepository
      .createQueryBuilder('contenido')
      .leftJoinAndSelect('contenido.decada', 'decada')
      .leftJoinAndSelect('contenido.categoria', 'categoria')
      .leftJoinAndSelect('contenido.imagenes', 'imagenes')
      .leftJoinAndSelect('contenido.videos', 'videos')
      .leftJoinAndSelect('contenido.contenidoEtiquetas', 'contenidoEtiquetas')
      .leftJoinAndSelect('contenidoEtiquetas.etiqueta', 'etiqueta');

    if (query.decadaId) {
      qb.andWhere('contenido.decadaId = :decadaId', { decadaId: query.decadaId });
    }
    if (query.categoriaId) {
      qb.andWhere('contenido.categoriaId = :categoriaId', { categoriaId: query.categoriaId });
    }
    if (query.anio) {
      qb.andWhere('contenido.anio = :anio', { anio: query.anio });
    }
    if (query.publicado !== undefined) {
      qb.andWhere('contenido.publicado = :publicado', { publicado: query.publicado });
    }
    if (query.q) {
      qb.andWhere('(contenido.titulo ILIKE :q OR contenido.descripcion ILIKE :q)', {
        q: `%${query.q}%`,
      });
    }
    if (query.etiquetaId) {
      // Join adicional exclusivo para filtrar (no para traer datos, ya lo trae
      // el leftJoinAndSelect de arriba); subquery evita que el filtro por
      // etiqueta reduzca las etiquetas visibles del resto de resultados.
      qb.andWhere(
        `contenido.id IN (
          SELECT ce.contenido_id FROM contenido_etiquetas ce WHERE ce.etiqueta_id = :etiquetaId
        )`,
        { etiquetaId: query.etiquetaId },
      );
    }

    const [items, total] = await qb
      .orderBy('contenido.createdAt', 'DESC')
      .skip((pagina - 1) * limite)
      .take(limite)
      .getManyAndCount();

    return { items, total, pagina, limite };
  }

  async findOne(id: string): Promise<Contenido> {
    const contenido = await this.contenidoRepository.findOne({
      where: { id },
      relations: RELACIONES_DEFAULT,
    });
    if (!contenido) {
      throw new NotFoundException(`Contenido ${id} no encontrado`);
    }
    return contenido;
  }

  async findBySlug(slug: string): Promise<Contenido> {
    const contenido = await this.contenidoRepository.findOne({
      where: { slug },
      relations: RELACIONES_DEFAULT,
    });
    if (!contenido || !contenido.publicado) {
      throw new NotFoundException(`Contenido con slug "${slug}" no encontrado`);
    }
    return contenido;
  }

  async update(id: string, dto: UpdateContenidoDto): Promise<Contenido> {
    const contenido = await this.findOne(id);

    if (dto.slug && dto.slug !== contenido.slug) {
      await this.assertSlugDisponible(dto.slug);
    }
    if (dto.decadaId) {
      await this.decadasService.findOne(dto.decadaId);
    }
    if (dto.categoriaId) {
      await this.categoriasService.findOne(dto.categoriaId);
    }

    const { etiquetaIds, imagenes, videos, ...resto } = dto;
    Object.assign(contenido, resto);

    // imagenes/videos: si vienen en el DTO, se reemplaza la colección completa.
    if (imagenes) {
      contenido.imagenes = imagenes.map((img) =>
        this.contenidoRepository.manager.create(Imagen, img),
      );
    }
    if (videos) {
      contenido.videos = videos.map((vid) =>
        this.contenidoRepository.manager.create(Video, vid),
      );
    }

    const guardado = await this.contenidoRepository.save(contenido);

    if (etiquetaIds) {
      await this.contenidoEtiquetaRepository.delete({ contenidoId: id });
      if (etiquetaIds.length) {
        await this.asociarEtiquetas(id, etiquetaIds);
      }
    }

    return this.findOne(guardado.id);
  }

  async remove(id: string): Promise<void> {
    const contenido = await this.findOne(id);
    await this.contenidoRepository.remove(contenido);
  }

  private async asociarEtiquetas(contenidoId: string, etiquetaIds: string[]): Promise<void> {
    const relaciones = etiquetaIds.map((etiquetaId) =>
      this.contenidoEtiquetaRepository.create({ contenidoId, etiquetaId }),
    );
    await this.contenidoEtiquetaRepository.save(relaciones);
  }

  private async assertSlugDisponible(slug: string): Promise<void> {
    const existente = await this.contenidoRepository.findOne({ where: { slug } });
    if (existente) {
      throw new ConflictException(`Ya existe un contenido con slug "${slug}"`);
    }
  }
}