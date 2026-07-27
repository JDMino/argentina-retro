import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EtiquetasService } from './etiquetas.service';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('etiquetas')
export class EtiquetasController {
  constructor(private readonly etiquetasService: EtiquetasService) {}

  @Get()
  findAll() {
    return this.etiquetasService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateEtiquetaDto) {
    return this.etiquetasService.create(dto);
  }
}