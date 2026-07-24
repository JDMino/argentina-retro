import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contenido } from './entities/contenido.entity';
import { Etiqueta } from './entities/etiqueta.entity';
import { ContenidoEtiqueta } from './entities/contenido-etiqueta.entity';
import { Imagen } from '../multimedia/entities/imagen.entity';
import { Video } from '../multimedia/entities/video.entity';
import { ContenidoService } from './contenido.service';
import { ContenidoController } from './contenido.controller';
import { DecadasModule } from '../decadas/decadas.module';
import { CategoriasModule } from '../categorias/categorias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contenido, Etiqueta, ContenidoEtiqueta, Imagen, Video]),
    DecadasModule,
    CategoriasModule,
  ],
  controllers: [ContenidoController],
  providers: [ContenidoService],
  exports: [ContenidoService],
})
export class ContenidoModule {}