import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { FindComentariosQueryDto } from './dto/find-comentarios-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get()
  findAllByContenido(@Query() query: FindComentariosQueryDto) {
    return this.comentariosService.findAllByContenido(query.contenidoId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateComentarioDto,
  ) {
    return this.comentariosService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser() user: { id: string; roles: string[] },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateComentarioDto,
  ) {
    return this.comentariosService.update(id, user, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: { id: string; roles: string[] },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.comentariosService.remove(id, user);
  }
}