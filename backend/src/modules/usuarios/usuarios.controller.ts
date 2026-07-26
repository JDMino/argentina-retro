import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Patch('me')
  async actualizarPerfil(@CurrentUser() user: { id: string }, @Body() dto: UpdatePerfilDto) {
    const usuario = await this.usuariosService.actualizarPerfil(user.id, dto);
    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      roles: usuario.roles.map((rol) => rol.nombre),
    };
  }

  @Patch('me/password')
  async cambiarPassword(@CurrentUser() user: { id: string }, @Body() dto: CambiarPasswordDto) {
    await this.usuariosService.cambiarPassword(user.id, dto.passwordActual, dto.passwordNueva);
    return { mensaje: 'Contraseña actualizada correctamente.' };
  }
}