import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Contenido } from '../../contenido/entities/contenido.entity';

@Entity('videos')
export class Video extends BaseEntity {
  @Column({ name: 'youtube_video_id', length: 20 })
  youtubeVideoId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
titulo: string | null;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @Column({ name: 'contenido_id' })
  contenidoId: string;

  @ManyToOne(() => Contenido, (contenido) => contenido.videos, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'contenido_id' })
  contenido: Contenido;
}