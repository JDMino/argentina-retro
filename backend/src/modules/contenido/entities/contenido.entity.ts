import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Decada } from '../../decadas/entities/decada.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Imagen } from '../../multimedia/entities/imagen.entity';
import { Video } from '../../multimedia/entities/video.entity';
import { ContenidoEtiqueta } from './contenido-etiqueta.entity';

interface EnlaceExterno {
  etiqueta: string;
  url: string;
}

@Entity('contenidos')
export class Contenido extends BaseEntity {
  @Column({ length: 200 })
  titulo: string;

  @Index({ unique: true })
  @Column({ length: 220 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'int', nullable: true })
  anio: number | null;

  @Column({ type: 'jsonb', nullable: true, name: 'enlaces_externos' })
  enlacesExternos: EnlaceExterno[] | null;

  @Column({ default: true })
  publicado: boolean;

  @Column({ name: 'decada_id' })
  decadaId: string;

  @ManyToOne(() => Decada, (decada) => decada.contenidos, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'decada_id' })
  decada: Decada;

  @Column({ name: 'categoria_id' })
  categoriaId: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.contenidos, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @OneToMany(() => Imagen, (imagen) => imagen.contenido, { cascade: true })
  imagenes: Imagen[];

  @OneToMany(() => Video, (video) => video.contenido, { cascade: true })
  videos: Video[];

  @OneToMany(() => ContenidoEtiqueta, (ce) => ce.contenido, { cascade: true })
  contenidoEtiquetas: ContenidoEtiqueta[];

  // NOTA: comentarios y favoritos se agregan en Etapa 6-7.
}