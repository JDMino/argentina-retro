import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1721830000000 implements MigrationInterface {
  name = 'InitialSchema1721830000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE "decadas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "nombre" varchar(100) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "anio_inicio" int NOT NULL,
        "anio_fin" int NOT NULL,
        "descripcion" text,
        "paleta" jsonb,
        "orden" int NOT NULL DEFAULT 0,
        "activa" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_decadas" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_decadas_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "categorias" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "nombre" varchar(100) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "icono" varchar(50),
        "descripcion" text,
        "orden" int NOT NULL DEFAULT 0,
        "activa" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_categorias" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_categorias_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "etiquetas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "nombre" varchar(60) NOT NULL,
        "slug" varchar(60) NOT NULL,
        CONSTRAINT "PK_etiquetas" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_etiquetas_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "contenidos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "titulo" varchar(200) NOT NULL,
        "slug" varchar(220) NOT NULL,
        "descripcion" text,
        "anio" int,
        "enlaces_externos" jsonb,
        "publicado" boolean NOT NULL DEFAULT true,
        "decada_id" uuid NOT NULL,
        "categoria_id" uuid NOT NULL,
        CONSTRAINT "PK_contenidos" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_contenidos_slug" UNIQUE ("slug"),
        CONSTRAINT "FK_contenidos_decada" FOREIGN KEY ("decada_id")
          REFERENCES "decadas"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_contenidos_categoria" FOREIGN KEY ("categoria_id")
          REFERENCES "categorias"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_contenidos_decada_id" ON "contenidos" ("decada_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_contenidos_categoria_id" ON "contenidos" ("categoria_id")`);

    await queryRunner.query(`
      CREATE TABLE "contenido_etiquetas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "contenido_id" uuid NOT NULL,
        "etiqueta_id" uuid NOT NULL,
        CONSTRAINT "PK_contenido_etiquetas" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_contenido_etiquetas" UNIQUE ("contenido_id", "etiqueta_id"),
        CONSTRAINT "FK_ce_contenido" FOREIGN KEY ("contenido_id")
          REFERENCES "contenidos"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ce_etiqueta" FOREIGN KEY ("etiqueta_id")
          REFERENCES "etiquetas"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "imagenes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "url" varchar(500) NOT NULL,
        "texto_alternativo" varchar(255),
        "orden" int NOT NULL DEFAULT 0,
        "contenido_id" uuid NOT NULL,
        CONSTRAINT "PK_imagenes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_imagenes_contenido" FOREIGN KEY ("contenido_id")
          REFERENCES "contenidos"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_imagenes_contenido_id" ON "imagenes" ("contenido_id")`);

    await queryRunner.query(`
      CREATE TABLE "videos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "youtube_video_id" varchar(20) NOT NULL,
        "titulo" varchar(200),
        "orden" int NOT NULL DEFAULT 0,
        "contenido_id" uuid NOT NULL,
        CONSTRAINT "PK_videos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_videos_contenido" FOREIGN KEY ("contenido_id")
          REFERENCES "contenidos"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_videos_contenido_id" ON "videos" ("contenido_id")`);

    await queryRunner.query(`
      CREATE TABLE "playlists" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "nombre" varchar(150) NOT NULL,
        "youtube_playlist_id" varchar(60),
        "descripcion" text,
        "decada_id" uuid,
        "categoria_id" uuid,
        CONSTRAINT "PK_playlists" PRIMARY KEY ("id"),
        CONSTRAINT "FK_playlists_decada" FOREIGN KEY ("decada_id")
          REFERENCES "decadas"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_playlists_categoria" FOREIGN KEY ("categoria_id")
          REFERENCES "categorias"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_playlists_decada_id" ON "playlists" ("decada_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "playlists"`);
    await queryRunner.query(`DROP TABLE "videos"`);
    await queryRunner.query(`DROP TABLE "imagenes"`);
    await queryRunner.query(`DROP TABLE "contenido_etiquetas"`);
    await queryRunner.query(`DROP TABLE "contenidos"`);
    await queryRunner.query(`DROP TABLE "etiquetas"`);
    await queryRunner.query(`DROP TABLE "categorias"`);
    await queryRunner.query(`DROP TABLE "decadas"`);
  }
}