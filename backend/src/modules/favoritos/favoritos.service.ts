import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favorito.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private readonly favoritosRepository: Repository<Favorito>,
  ) {}

  async create(usuarioId: string, contenidoId: string): Promise<Favorito> {
    const existente = await this.favoritosRepository.findOne({
      where: { usuarioId, contenidoId },
    });
    if (existente) {
      throw new ConflictException('Este contenido ya está en tus favoritos.');
    }

    const favorito = this.favoritosRepository.create({ usuarioId, contenidoId });
    return this.favoritosRepository.save(favorito);
  }

  findAllByUsuario(usuarioId: string): Promise<Favorito[]> {
    return this.favoritosRepository.find({
      where: { usuarioId },
      relations: { contenido: { imagenes: true, categoria: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(usuarioId: string, contenidoId: string): Promise<void> {
    const favorito = await this.favoritosRepository.findOne({
      where: { usuarioId, contenidoId },
    });
    if (!favorito) {
      throw new NotFoundException('Ese contenido no está en tus favoritos.');
    }
    await this.favoritosRepository.remove(favorito);
  }
}