import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContenidoEtiqueta } from './contenido-etiqueta.entity';

@Entity('etiquetas')
export class Etiqueta extends BaseEntity {
  @Column({ length: 60 })
  nombre: string;

  @Index({ unique: true })
  @Column({ length: 60 })
  slug: string;

  @OneToMany(() => ContenidoEtiqueta, (ce) => ce.etiqueta)
  contenidoEtiquetas: ContenidoEtiqueta[];
}