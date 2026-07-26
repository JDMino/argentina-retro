import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Contenido } from '../../contenido/entities/contenido.entity';

@Entity('favoritos')
@Unique(['usuarioId', 'contenidoId'])
export class Favorito extends BaseEntity {
  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'contenido_id' })
  contenidoId: string;

  @ManyToOne(() => Contenido, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contenido_id' })
  contenido: Contenido;
}