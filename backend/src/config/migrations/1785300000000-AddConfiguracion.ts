import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConfiguracion1785300000000 implements MigrationInterface {
    name = 'AddConfiguracion1785300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "configuracion" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "home_fondo_desktop_url" character varying,
                "home_fondo_mobile_url" character varying,
                CONSTRAINT "PK_configuracion" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "configuracion"`);
    }
}