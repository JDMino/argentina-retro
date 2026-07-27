import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etiqueta } from '../contenido/entities/etiqueta.entity';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';

@Injectable()
export class EtiquetasService {
  constructor(
    @InjectRepository(Etiqueta)
    private readonly etiquetasRepository: Repository<Etiqueta>,
  ) {}

  async findAll(): Promise<Etiqueta[]> {
    return this.etiquetasRepository.find({ order: { nombre: 'ASC' } });
  }

  async create(dto: CreateEtiquetaDto): Promise<Etiqueta> {
    const existente = await this.etiquetasRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existente) {
      throw new ConflictException(`Ya existe una etiqueta con slug "${dto.slug}"`);
    }
    const etiqueta = this.etiquetasRepository.create(dto);
    return this.etiquetasRepository.save(etiqueta);
  }
}