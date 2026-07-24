import { Entity, ManyToOne, JoinColumn, Column, Unique, PrimaryGeneratedColumn } from 'typeorm';
import { Contenido } from './contenido.entity';
import { Etiqueta } from './etiqueta.entity';

@Entity('contenido_etiquetas')
@Unique(['contenidoId', 'etiquetaId'])
export class ContenidoEtiqueta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'contenido_id' })
  contenidoId: string;

  @ManyToOne(() => Contenido, (contenido) => contenido.contenidoEtiquetas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contenido_id' })
  contenido: Contenido;

  @Column({ name: 'etiqueta_id' })
  etiquetaId: string;

  @ManyToOne(() => Etiqueta, (etiqueta) => etiqueta.contenidoEtiquetas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'etiqueta_id' })
  etiqueta: Etiqueta;
}