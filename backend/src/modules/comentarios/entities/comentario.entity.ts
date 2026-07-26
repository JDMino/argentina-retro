import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Contenido } from '../../contenido/entities/contenido.entity';

@Entity('comentarios')
export class Comentario extends BaseEntity {
  @Column({ type: 'text' })
  texto: string;

  @Column({ default: true })
  aprobado: boolean;

  @Index()
  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Index()
  @Column({ name: 'contenido_id' })
  contenidoId: string;

  @ManyToOne(() => Contenido, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contenido_id' })
  contenido: Contenido;
}