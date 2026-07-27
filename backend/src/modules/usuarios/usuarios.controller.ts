import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { UpdateUsuarioAdminDto } from './dto/update-usuario-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Usuario } from './entities/usuario.entity';

function serializar(usuario: Usuario) {
  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    activo: usuario.activo,
    debeCambiarPassword: usuario.debeCambiarPassword,
    roles: usuario.roles.map((rol) => rol.nombre),
    createdAt: usuario.createdAt,
  };
}

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Patch('me')
  async actualizarPerfil(@CurrentUser() user: { id: string }, @Body() dto: UpdatePerfilDto) {
    const usuario = await this.usuariosService.actualizarPerfil(user.id, dto);
    return serializar(usuario);
  }

  @Patch('me/password')
  async cambiarPassword(@CurrentUser() user: { id: string }, @Body() dto: CambiarPasswordDto) {
    await this.usuariosService.cambiarPassword(user.id, dto.passwordActual, dto.passwordNueva);
    return { mensaje: 'Contraseña actualizada correctamente.' };
  }

  // --- Administración (solo admin) ---

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll() {
    const usuarios = await this.usuariosService.findAll();
    return usuarios.map(serializar);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const usuario = await this.usuariosService.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return serializar(usuario);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async actualizarComoAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUsuarioAdminDto,
    @CurrentUser() admin: { id: string },
  ) {
    const usuario = await this.usuariosService.actualizarComoAdmin(id, dto, admin.id);
    return serializar(usuario);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() admin: { id: string }) {
    await this.usuariosService.eliminarComoAdmin(id, admin.id);
  }

  @Post(':id/resetear-password')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async resetearPassword(@Param('id', ParseUUIDPipe) id: string) {
    const passwordTemporal = await this.usuariosService.resetearPassword(id);
    return { passwordTemporal };
  }
}