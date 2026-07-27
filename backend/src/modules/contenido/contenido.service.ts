import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
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
    const where: FindOptionsWhere<Contenido> = {};
    if (query.decadaId) where.decadaId = query.decadaId;
    if (query.categoriaId) where.categoriaId = query.categoriaId;
    if (query.publicado !== undefined) where.publicado = query.publicado;

    const pagina = query.pagina ?? 1;
    const limite = query.limite ?? 20;

    const [items, total] = await this.contenidoRepository.findAndCount({
      where,
      relations: RELACIONES_DEFAULT,
      order: { createdAt: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
    });

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