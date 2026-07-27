import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async findByNombre(nombre: string): Promise<Rol | null> {
    return this.rolRepo.findOne({ where: { nombre } });
  }

  async findAll(): Promise<Rol[]> {
    return this.rolRepo.find({ order: { nombre: 'ASC' } });
  }

  async findByNombres(nombres: string[]): Promise<Rol[]> {
    if (nombres.length === 0) return [];
    return this.rolRepo
      .createQueryBuilder('rol')
      .where('rol.nombre IN (:...nombres)', { nombres })
      .getMany();
  }
}