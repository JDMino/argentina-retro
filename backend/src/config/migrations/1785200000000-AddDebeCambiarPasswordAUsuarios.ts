import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDebeCambiarPasswordAUsuarios1785200000000 implements MigrationInterface {
    name = 'AddDebeCambiarPasswordAUsuarios1785200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "debe_cambiar_password" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "debe_cambiar_password"`);
    }
}