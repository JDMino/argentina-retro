import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Decada } from '../../decadas/entities/decada.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('playlists')
export class Playlist extends BaseEntity {
  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'varchar', name: 'youtube_playlist_id', length: 60, nullable: true })
youtubePlaylistId: string | null;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ name: 'decada_id', nullable: true })
  decadaId: string | null;

  @ManyToOne(() => Decada, (decada) => decada.playlists, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'decada_id' })
  decada: Decada | null;

  @Column({ name: 'categoria_id', nullable: true })
  categoriaId: string | null;

  @ManyToOne(() => Categoria, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria | null;
}