import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoritosYComentarios1785069544602 implements MigrationInterface {
    name = 'AddFavoritosYComentarios1785069544602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comentarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "texto" text NOT NULL, "aprobado" boolean NOT NULL DEFAULT true, "usuario_id" uuid NOT NULL, "contenido_id" uuid NOT NULL, CONSTRAINT "PK_b60b1468bb275db8d5e875c4a78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1281c1e3cb210b0b3d6d09ab2e" ON "comentarios" ("usuario_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef77d80285b76b565f4ce30232" ON "comentarios" ("contenido_id") `);
        await queryRunner.query(`CREATE TABLE "favoritos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "usuario_id" uuid NOT NULL, "contenido_id" uuid NOT NULL, CONSTRAINT "UQ_354bb8506f176fa950e676c6cbd" UNIQUE ("usuario_id", "contenido_id"), CONSTRAINT "PK_2a6a4d0119130451dc0b644590a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comentarios" ADD CONSTRAINT "FK_1281c1e3cb210b0b3d6d09ab2e7" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comentarios" ADD CONSTRAINT "FK_ef77d80285b76b565f4ce302329" FOREIGN KEY ("contenido_id") REFERENCES "contenidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favoritos" ADD CONSTRAINT "FK_a5437f5339df26be381a7df84b7" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favoritos" ADD CONSTRAINT "FK_c991ad997920f3f1cfa89a1fd5d" FOREIGN KEY ("contenido_id") REFERENCES "contenidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favoritos" DROP CONSTRAINT "FK_c991ad997920f3f1cfa89a1fd5d"`);
        await queryRunner.query(`ALTER TABLE "favoritos" DROP CONSTRAINT "FK_a5437f5339df26be381a7df84b7"`);
        await queryRunner.query(`ALTER TABLE "comentarios" DROP CONSTRAINT "FK_ef77d80285b76b565f4ce302329"`);
        await queryRunner.query(`ALTER TABLE "comentarios" DROP CONSTRAINT "FK_1281c1e3cb210b0b3d6d09ab2e7"`);
        await queryRunner.query(`DROP TABLE "favoritos"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef77d80285b76b565f4ce30232"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1281c1e3cb210b0b3d6d09ab2e"`);
        await queryRunner.query(`DROP TABLE "comentarios"`);
    }
}