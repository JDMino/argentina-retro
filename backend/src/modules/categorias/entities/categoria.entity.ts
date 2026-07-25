import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Contenido } from '../../contenido/entities/contenido.entity';

@Entity('categorias')
export class Categoria extends BaseEntity {
  @Column({ length: 100 })
  nombre: string;

  @Index({ unique: true })
  @Column({ length: 100 })
  slug: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icono: string | null;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @Column({ default: true })
  activa: boolean;

  @OneToMany(() => Contenido, (contenido) => contenido.categoria)
  contenidos: Contenido[];
}