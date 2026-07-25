import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { FindCategoriasQueryDto } from './dto/find-categorias-query.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  @Get()
  async findAll(@Query() query: FindCategoriasQueryDto) {
    if (query.decadaId) {
      return this.categoriasService.findByDecada(query.decadaId);
    }
    return this.categoriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriasService.remove(id);
  }
}