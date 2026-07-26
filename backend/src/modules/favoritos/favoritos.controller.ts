import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('favoritos')
@UseGuards(JwtAuthGuard)
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateFavoritoDto) {
    return this.favoritosService.create(user.id, dto.contenidoId);
  }

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.favoritosService.findAllByUsuario(user.id);
  }

  @Delete(':contenidoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: { id: string },
    @Param('contenidoId', ParseUUIDPipe) contenidoId: string,
  ) {
    return this.favoritosService.remove(user.id, contenidoId);
  }
}