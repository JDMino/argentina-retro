import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * Fila única de configuración global del sitio (fondo del Home, y lo que se
 * agregue a futuro). El service garantiza que exista una sola fila —
 * no hay una FK ni un enum de "tipo de config" porque hoy solo hace falta
 * una instancia; si en el futuro se necesitan configuraciones por entorno o
 * multi-tenant, ahí sí conviene repensar el modelo.
 */
@Entity('configuracion')
export class Configuracion extends BaseEntity {
  @Column({ name: 'home_fondo_desktop_url', type: 'varchar', nullable: true })
  homeFondoDesktopUrl: string | null;

  @Column({ name: 'home_fondo_mobile_url', type: 'varchar', nullable: true })
  homeFondoMobileUrl: string | null;
}