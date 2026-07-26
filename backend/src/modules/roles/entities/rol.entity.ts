import { Entity, Column, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('roles')
export class Rol extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 50 })
  nombre: string; // ej: 'admin', 'usuario'

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @ManyToMany(() => Usuario, (usuario) => usuario.roles)
  usuarios: Usuario[];
}