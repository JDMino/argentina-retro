import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsuariosYRoles1785033758029 implements MigrationInterface {
    name = 'AddUsuariosYRoles1785033758029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "nombre" character varying(100), "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_446adfc18b35418aac32ae0b7b" ON "usuarios" ("email") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "nombre" character varying(50) NOT NULL, "descripcion" text, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a5be7aa67e759e347b1c6464e1" ON "roles" ("nombre") `);
        await queryRunner.query(`CREATE TABLE "usuario_roles" ("usuario_id" uuid NOT NULL, "rol_id" uuid NOT NULL, CONSTRAINT "PK_43e0c343408b4c5c79be51e7202" PRIMARY KEY ("usuario_id", "rol_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f4660653ecea0eef621bae5209" ON "usuario_roles" ("usuario_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a60de73dab09515692949c13a" ON "usuario_roles" ("rol_id") `);
        await queryRunner.query(`ALTER TABLE "usuario_roles" ADD CONSTRAINT "FK_f4660653ecea0eef621bae52097" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuario_roles" ADD CONSTRAINT "FK_0a60de73dab09515692949c13a5" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_roles" DROP CONSTRAINT "FK_0a60de73dab09515692949c13a5"`);
        await queryRunner.query(`ALTER TABLE "usuario_roles" DROP CONSTRAINT "FK_f4660653ecea0eef621bae52097"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a60de73dab09515692949c13a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4660653ecea0eef621bae5209"`);
        await queryRunner.query(`DROP TABLE "usuario_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5be7aa67e759e347b1c6464e1"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_446adfc18b35418aac32ae0b7b"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }
}