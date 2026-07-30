import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Contenido } from '../../contenido/entities/contenido.entity';
import { Playlist } from '../../playlists/entities/playlist.entity';

@Entity('decadas')
export class Decada extends BaseEntity {
  @Column({ length: 100 })
  nombre: string; // ej: "Los 80"

  @Index({ unique: true })
  @Column({ length: 100 })
  slug: string; // ej: "los-80"

  @Column({ name: 'anio_inicio', type: 'int' })
  anioInicio: number;

  @Column({ name: 'anio_fin', type: 'int' })
  anioFin: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'jsonb', nullable: true })
  paleta: Record<string, string> | null;

  @Column({ name: 'imagen_fondo_desktop_url', type: 'varchar', nullable: true })
  imagenFondoDesktopUrl: string | null;

  @Column({ name: 'imagen_fondo_mobile_url', type: 'varchar', nullable: true })
  imagenFondoMobileUrl: string | null;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @Column({ default: true })
  activa: boolean;

  @OneToMany(() => Contenido, (contenido) => contenido.decada)
  contenidos: Contenido[];

  @OneToMany(() => Playlist, (playlist) => playlist.decada)
  playlists: Playlist[];
}