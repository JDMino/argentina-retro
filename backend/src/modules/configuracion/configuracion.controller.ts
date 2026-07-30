import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Get()
  obtener() {
    return this.configuracionService.obtener();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  actualizar(@Body() dto: UpdateConfiguracionDto) {
    return this.configuracionService.actualizar(dto);
  }
}