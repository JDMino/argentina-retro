import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './entities/comentario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { FindComentariosAdminQueryDto } from './dto/find-comentarios-admin-query.dto';
import { ModerarComentarioDto } from './dto/moderar-comentario.dto';

interface UsuarioActual {
  id: string;
  roles: string[];
}

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentariosRepository: Repository<Comentario>,
  ) {}

  findAllByContenido(contenidoId: string): Promise<Comentario[]> {
    return this.comentariosRepository.find({
      where: { contenidoId, aprobado: true },
      relations: { usuario: true },
      select: {
        id: true,
        texto: true,
        createdAt: true,
        updatedAt: true,
        usuarioId: true,
        usuario: { id: true, nombre: true, email: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  create(usuarioId: string, dto: CreateComentarioDto): Promise<Comentario> {
    const comentario = this.comentariosRepository.create({
      usuarioId,
      contenidoId: dto.contenidoId,
      texto: dto.texto,
    });
    return this.comentariosRepository.save(comentario);
  }

  async update(
    id: string,
    usuarioActual: UsuarioActual,
    dto: UpdateComentarioDto,
  ): Promise<Comentario> {
    const comentario = await this.findOneOrFail(id);
    this.verificarPermiso(comentario, usuarioActual);
    comentario.texto = dto.texto;
    return this.comentariosRepository.save(comentario);
  }

  async remove(id: string, usuarioActual: UsuarioActual): Promise<void> {
    const comentario = await this.findOneOrFail(id);
    this.verificarPermiso(comentario, usuarioActual);
    await this.comentariosRepository.remove(comentario);
  }

  async findAllAdmin(query: FindComentariosAdminQueryDto) {
    const pagina = query.pagina ?? 1;
    const limite = query.limite ?? 20;

    const qb = this.comentariosRepository
      .createQueryBuilder('comentario')
      .leftJoin('comentario.usuario', 'usuario')
      .addSelect(['usuario.id', 'usuario.nombre', 'usuario.email'])
      .leftJoin('comentario.contenido', 'contenido')
      .addSelect(['contenido.id', 'contenido.titulo', 'contenido.slug']);

    if (query.contenidoId) {
      qb.andWhere('comentario.contenidoId = :contenidoId', { contenidoId: query.contenidoId });
    }
    if (query.aprobado !== undefined) {
      qb.andWhere('comentario.aprobado = :aprobado', { aprobado: query.aprobado });
    }
    if (query.q) {
      qb.andWhere('comentario.texto ILIKE :q', { q: `%${query.q}%` });
    }

    const [items, total] = await qb
      .orderBy('comentario.createdAt', 'DESC')
      .skip((pagina - 1) * limite)
      .take(limite)
      .getManyAndCount();

    return { items, total, pagina, limite };
  }

  async moderar(id: string, dto: ModerarComentarioDto): Promise<Comentario> {
    const comentario = await this.findOneOrFail(id);
    comentario.aprobado = dto.aprobado;
    return this.comentariosRepository.save(comentario);
  }

  private async findOneOrFail(id: string): Promise<Comentario> {
    const comentario = await this.comentariosRepository.findOne({ where: { id } });
    if (!comentario) {
      throw new NotFoundException(`Comentario ${id} no encontrado`);
    }
    return comentario;
  }

  private verificarPermiso(comentario: Comentario, usuarioActual: UsuarioActual): void {
    const esAutor = comentario.usuarioId === usuarioActual.id;
    const esAdmin = usuarioActual.roles?.includes('admin');
    if (!esAutor && !esAdmin) {
      throw new ForbiddenException('No podés modificar un comentario que no es tuyo.');
    }
  }
}