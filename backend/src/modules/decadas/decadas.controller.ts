import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DecadasService } from './decadas.service';
import { CreateDecadaDto } from './dto/create-decada.dto';
import { UpdateDecadaDto } from './dto/update-decada.dto';

@Controller('decadas')
export class DecadasController {
  constructor(private readonly decadasService: DecadasService) {}

  @Post()
  create(@Body() dto: CreateDecadaDto) {
    return this.decadasService.create(dto);
  }

  @Get()
  findAll() {
    return this.decadasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.decadasService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.decadasService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDecadaDto) {
    return this.decadasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.decadasService.remove(id);
  }
}