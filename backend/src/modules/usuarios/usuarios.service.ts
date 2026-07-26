import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

interface CrearUsuarioInput {
  email: string;
  passwordHash: string;
  nombre?: string;
  roles: Rol[];
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
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

  async crear(datos: CrearUsuarioInput): Promise<Usuario> {
    const existente = await this.findByEmail(datos.email);
    if (existente) {
      throw new ConflictException('Ya existe un usuario registrado con ese email.');
    }
    const usuario = this.usuarioRepo.create(datos);
    return this.usuarioRepo.save(usuario);
  }

  async actualizarPerfil(id: string, dto: UpdatePerfilDto): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id }, relations: { roles: true } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
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

    usuario.passwordHash = await bcrypt.hash(passwordNueva, 10);
    await this.usuarioRepo.save(usuario);
  }
}