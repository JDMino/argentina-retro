import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';

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
}