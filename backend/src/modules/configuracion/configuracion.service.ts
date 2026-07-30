import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private readonly configuracionRepository: Repository<Configuracion>,
  ) {}

  /**
   * Devuelve la única fila de configuración, creándola con valores por
   * defecto (null) si todavía no existe — evita necesitar un seed dedicado
   * o un paso manual de setup.
   */
  async obtener(): Promise<Configuracion> {
    const existente = await this.configuracionRepository.find({ take: 1 });
    if (existente.length > 0) {
      return existente[0];
    }
    const nueva = this.configuracionRepository.create({});
    return this.configuracionRepository.save(nueva);
  }

  async actualizar(dto: UpdateConfiguracionDto): Promise<Configuracion> {
    const configuracion = await this.obtener();
    Object.assign(configuracion, dto);
    return this.configuracionRepository.save(configuracion);
  }
}