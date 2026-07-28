import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etiqueta } from '../contenido/entities/etiqueta.entity';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';

export interface EtiquetaConContador extends Etiqueta {
  contadorUso: number;
}

@Injectable()
export class EtiquetasService {
  constructor(
    @InjectRepository(Etiqueta)
    private readonly etiquetasRepository: Repository<Etiqueta>,
  ) {}

  async findAll(): Promise<EtiquetaConContador[]> {
    // Contador de uso vía subquery (no leftJoin+groupBy) para no repetir filas
    // y para que el resultado siga siendo instancias reales de Etiqueta.
    const etiquetas = await this.etiquetasRepository.find({ order: { nombre: 'ASC' } });
    const conteos = await this.etiquetasRepository
      .createQueryBuilder('etiqueta')
      .leftJoin('etiqueta.contenidoEtiquetas', 'ce')
      .select('etiqueta.id', 'etiquetaId')
      .addSelect('COUNT(ce.id)', 'contador')
      .groupBy('etiqueta.id')
      .getRawMany<{ etiquetaId: string; contador: string }>();

    const contadorPorId = new Map(conteos.map((c) => [c.etiquetaId, Number(c.contador)]));

    return etiquetas.map((etiqueta) => ({
      ...etiqueta,
      contadorUso: contadorPorId.get(etiqueta.id) ?? 0,
    }));
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

  async update(id: string, dto: UpdateEtiquetaDto): Promise<Etiqueta> {
    const etiqueta = await this.findOneOrFail(id);
    if (dto.slug && dto.slug !== etiqueta.slug) {
      const existente = await this.etiquetasRepository.findOne({ where: { slug: dto.slug } });
      if (existente) {
        throw new ConflictException(`Ya existe una etiqueta con slug "${dto.slug}"`);
      }
    }
    Object.assign(etiqueta, dto);
    return this.etiquetasRepository.save(etiqueta);
  }

  async remove(id: string): Promise<void> {
    const etiqueta = await this.findOneOrFail(id);
    const enUso = await this.etiquetasRepository
      .createQueryBuilder('etiqueta')
      .leftJoin('etiqueta.contenidoEtiquetas', 'ce')
      .where('etiqueta.id = :id', { id })
      .select('COUNT(ce.id)', 'contador')
      .getRawOne<{ contador: string }>();

    if (Number(enUso?.contador ?? 0) > 0) {
      throw new ConflictException(
        `No se puede eliminar "${etiqueta.nombre}": está en uso en al menos un contenido.`,
      );
    }
    await this.etiquetasRepository.remove(etiqueta);
  }

  private async findOneOrFail(id: string): Promise<Etiqueta> {
    const etiqueta = await this.etiquetasRepository.findOne({ where: { id } });
    if (!etiqueta) {
      throw new NotFoundException(`Etiqueta ${id} no encontrada`);
    }
    return etiqueta;
  }
}