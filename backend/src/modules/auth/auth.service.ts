import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RolesService } from '../roles/roles.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const rolUsuario = await this.rolesService.findByNombre('usuario');
    if (!rolUsuario) {
      throw new Error('El rol "usuario" no existe. Corré el seed antes de registrar usuarios.');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const usuario = await this.usuariosService.crear({
      email: dto.email,
      passwordHash,
      nombre: dto.nombre,
      roles: [rolUsuario],
    });

    return this.buildAuthResponse(usuario);
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.findByEmail(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (!usuario.activo) {
      throw new ForbiddenException('Tu cuenta está suspendida. Contactate con soporte para más información.');
    }

    return this.buildAuthResponse(usuario);
  }

  private buildAuthResponse(usuario: Usuario) {
    const roles = usuario.roles?.map((rol) => rol.nombre) ?? [];
    const payload = { sub: usuario.id, email: usuario.email, roles };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        roles,
        debeCambiarPassword: usuario.debeCambiarPassword,
      },
    };
  }
}