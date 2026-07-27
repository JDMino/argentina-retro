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
    const where: Record<string, unknown> = {};
    if (query.contenidoId) where.contenidoId = query.contenidoId;
    if (query.aprobado !== undefined) where.aprobado = query.aprobado;

    const pagina = query.pagina ?? 1;
    const limite = query.limite ?? 20;

    const [items, total] = await this.comentariosRepository.findAndCount({
      where,
      relations: { usuario: true, contenido: true },
      select: {
        id: true,
        texto: true,
        aprobado: true,
        createdAt: true,
        updatedAt: true,
        usuarioId: true,
        contenidoId: true,
        usuario: { id: true, nombre: true, email: true },
        contenido: { id: true, titulo: true, slug: true },
      },
      order: { createdAt: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
    });

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