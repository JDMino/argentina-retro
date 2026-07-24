import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * DataSource exclusivo para el CLI de TypeORM (migration:run, migration:generate, etc).
 * La app en runtime sigue usando TypeOrmModule.forRootAsync en app.module.ts;
 * esto no lo reemplaza, es solo lo que necesita el CLI.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'argentina_retro',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/config/migrations/*.ts'],
  synchronize: false,
});