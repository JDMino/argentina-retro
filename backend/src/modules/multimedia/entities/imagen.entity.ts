import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Contenido } from '../../contenido/entities/contenido.entity';

@Entity('imagenes')
export class Imagen extends BaseEntity {
  @Column({ length: 500 })
  url: string;

  @Column({ type: 'varchar', name: 'texto_alternativo', length: 255, nullable: true })
textoAlternativo: string | null;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @Column({ name: 'contenido_id' })
  contenidoId: string;

  @ManyToOne(() => Contenido, (contenido) => contenido.imagenes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'contenido_id' })
  contenido: Contenido;
}