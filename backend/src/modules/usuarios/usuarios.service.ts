import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { RolesService } from '../roles/roles.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { UpdateUsuarioAdminDto } from './dto/update-usuario-admin.dto';

interface CrearUsuarioInput {
  email: string;
  passwordHash: string;
  nombre?: string;
  roles: Rol[];
}

const SALT_ROUNDS = 10;

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly rolesService: RolesService,
  ) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({
      where: { email },
      relations: { roles: true },
    });
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find({
      relations: { roles: true },
      order: { createdAt: 'DESC' },
    });
  }

  async crear(datos: CrearUsuarioInput): Promise<Usuario> {
    const existente = await this.findByEmail(datos.email);
    if (existente) {
      throw new ConflictException('Ya existe un usuario registrado con ese email.');
    }
    const usuario = this.usuarioRepo.create(datos);
    return this.usuarioRepo.save(usuario);
  }

  async actualizarPerfil(id: string, dto: UpdatePerfilDto): Promise<Usuario> {
    const usuario = await this.buscarOFallar(id);

    if (dto.email && dto.email !== usuario.email) {
      const existente = await this.findByEmail(dto.email);
      if (existente) {
        throw new ConflictException('Ya existe un usuario registrado con ese email.');
      }
      usuario.email = dto.email;
    }

    if (dto.nombre !== undefined) {
      usuario.nombre = dto.nombre;
    }

    return this.usuarioRepo.save(usuario);
  }

  async cambiarPassword(id: string, passwordActual: string, passwordNueva: string): Promise<void> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const passwordValida = await bcrypt.compare(passwordActual, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('La contraseña actual no es correcta.');
    }

    usuario.passwordHash = await bcrypt.hash(passwordNueva, SALT_ROUNDS);
    usuario.debeCambiarPassword = false;
    await this.usuarioRepo.save(usuario);
  }

  // --- Administración (solo admin) ---

  async actualizarComoAdmin(
    id: string,
    dto: UpdateUsuarioAdminDto,
    idAdminActual: string,
  ): Promise<Usuario> {
    const usuario = await this.buscarOFallar(id);
    const esUnoMismo = id === idAdminActual;

    if (esUnoMismo && (dto.roles !== undefined || dto.activo !== undefined)) {
      throw new ForbiddenException(
        'No podés modificar tus propios roles ni tu propio estado de cuenta.',
      );
    }

    if (dto.email && dto.email !== usuario.email) {
      const existente = await this.findByEmail(dto.email);
      if (existente) {
        throw new ConflictException('Ya existe un usuario registrado con ese email.');
      }
      usuario.email = dto.email;
    }

    if (dto.nombre !== undefined) {
      usuario.nombre = dto.nombre;
    }

    if (dto.activo !== undefined) {
      usuario.activo = dto.activo;
    }

    if (dto.roles !== undefined) {
      usuario.roles = await this.rolesService.findByNombres(dto.roles);
    }

    return this.usuarioRepo.save(usuario);
  }

  async eliminarComoAdmin(id: string, idAdminActual: string): Promise<void> {
    if (id === idAdminActual) {
      throw new ForbiddenException('No podés eliminar tu propia cuenta desde el panel.');
    }
    const usuario = await this.buscarOFallar(id);
    await this.usuarioRepo.remove(usuario);
  }

  async resetearPassword(id: string): Promise<string> {
    const usuario = await this.buscarOFallar(id);
    const passwordTemporal = randomBytes(6).toString('base64url'); // ~8 caracteres alfanuméricos
    usuario.passwordHash = await bcrypt.hash(passwordTemporal, SALT_ROUNDS);
    usuario.debeCambiarPassword = true;
    await this.usuarioRepo.save(usuario);
    return passwordTemporal;
  }

  private async buscarOFallar(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id }, relations: { roles: true } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return usuario;
  }
}