import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Decada } from './entities/decada.entity';
import { CreateDecadaDto } from './dto/create-decada.dto';
import { UpdateDecadaDto } from './dto/update-decada.dto';

@Injectable()
export class DecadasService {
  constructor(
    @InjectRepository(Decada)
    private readonly decadasRepository: Repository<Decada>,
  ) {}

  async create(dto: CreateDecadaDto): Promise<Decada> {
    await this.assertSlugDisponible(dto.slug);
    const decada = this.decadasRepository.create(dto);
    return this.decadasRepository.save(decada);
  }

  findAll(activa?: boolean): Promise<Decada[]> {
    return this.decadasRepository.find({
      where: activa !== undefined ? { activa } : {},
      order: { orden: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Decada> {
    const decada = await this.decadasRepository.findOne({ where: { id } });
    if (!decada) {
      throw new NotFoundException(`Década ${id} no encontrada`);
    }
    return decada;
  }

  async findBySlug(slug: string): Promise<Decada> {
    const decada = await this.decadasRepository.findOne({ where: { slug } });
    if (!decada || !decada.activa) {
      throw new NotFoundException(`Década con slug "${slug}" no encontrada`);
    }
    return decada;
  }

  async update(id: string, dto: UpdateDecadaDto): Promise<Decada> {
    const decada = await this.findOne(id);
    if (dto.slug && dto.slug !== decada.slug) {
      await this.assertSlugDisponible(dto.slug);
    }
    Object.assign(decada, dto);
    return this.decadasRepository.save(decada);
  }

  async remove(id: string): Promise<void> {
    const decada = await this.findOne(id);
    await this.decadasRepository.remove(decada);
  }

  private async assertSlugDisponible(slug: string): Promise<void> {
    const existente = await this.decadasRepository.findOne({ where: { slug } });
    if (existente) {
      throw new ConflictException(`Ya existe una década con slug "${slug}"`);
    }
  }
}