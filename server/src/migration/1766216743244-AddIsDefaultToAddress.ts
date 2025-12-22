import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDefaultToAddress1766216743244 implements MigrationInterface {
    name = 'AddIsDefaultToAddress1766216743244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "isDefault" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "isDefault"`);
    }

}
