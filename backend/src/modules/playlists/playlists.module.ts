import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';

// Módulo mínimo: solo registra la entidad para que las relaciones
// (Decada.playlists) resuelvan. El CRUD completo llega en Etapa 5.
@Module({
  imports: [TypeOrmModule.forFeature([Playlist])],
  exports: [TypeOrmModule],
})
export class PlaylistsModule {}