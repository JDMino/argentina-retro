import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { FindPlaylistsQueryDto } from './dto/find-playlists-query.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistsRepository: Repository<Playlist>,
  ) {}

  create(dto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = this.playlistsRepository.create(dto);
    return this.playlistsRepository.save(playlist);
  }

  findAll(query: FindPlaylistsQueryDto): Promise<Playlist[]> {
    const where: FindOptionsWhere<Playlist> = {};
    if (query.decadaId) where.decadaId = query.decadaId;
    if (query.categoriaId) where.categoriaId = query.categoriaId;
    return this.playlistsRepository.find({ where });
  }

  async findOne(id: string): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({ where: { id } });
    if (!playlist) {
      throw new NotFoundException(`Playlist ${id} no encontrada`);
    }
    return playlist;
  }

  async update(id: string, dto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.findOne(id);
    Object.assign(playlist, dto);
    return this.playlistsRepository.save(playlist);
  }

  async remove(id: string): Promise<void> {
    const playlist = await this.findOne(id);
    await this.playlistsRepository.remove(playlist);
  }
}