import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFondoADecadas1785400000000 implements MigrationInterface {
    name = 'AddFondoADecadas1785400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decadas" ADD "imagen_fondo_desktop_url" character varying`);
        await queryRunner.query(`ALTER TABLE "decadas" ADD "imagen_fondo_mobile_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decadas" DROP COLUMN "imagen_fondo_mobile_url"`);
        await queryRunner.query(`ALTER TABLE "decadas" DROP COLUMN "imagen_fondo_desktop_url"`);
    }
}