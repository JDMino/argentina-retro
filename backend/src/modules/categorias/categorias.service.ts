import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    await this.assertSlugDisponible(dto.slug);
    const categoria = this.categoriasRepository.create(dto);
    return this.categoriasRepository.save(categoria);
  }

  findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.find({ order: { orden: 'ASC' } });
  }

  async findByDecada(decadaId: string): Promise<Categoria[]> {
    return this.categoriasRepository
      .createQueryBuilder('categoria')
      .innerJoin('categoria.contenidos', 'contenido')
      .where('contenido.decadaId = :decadaId', { decadaId })
      .andWhere('categoria.activa = :activa', { activa: true })
      .andWhere('contenido.publicado = :publicado', { publicado: true })
      .orderBy('categoria.orden', 'ASC')
      .distinct(true)
      .getMany();
  }

  async findOne(id: string): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoría ${id} no encontrada`);
    }
    return categoria;
  }

  async update(id: string, dto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);
    if (dto.slug && dto.slug !== categoria.slug) {
      await this.assertSlugDisponible(dto.slug);
    }
    Object.assign(categoria, dto);
    return this.categoriasRepository.save(categoria);
  }

  async remove(id: string): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriasRepository.remove(categoria);
  }

  private async assertSlugDisponible(slug: string): Promise<void> {
    const existente = await this.categoriasRepository.findOne({ where: { slug } });
    if (existente) {
      throw new ConflictException(`Ya existe una categoría con slug "${slug}"`);
    }
  }
}