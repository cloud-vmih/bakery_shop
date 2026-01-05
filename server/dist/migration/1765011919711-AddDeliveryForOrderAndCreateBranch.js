"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDeliveryForOrderAndCreateBranch1765011919711 = void 0;
class AddDeliveryForOrderAndCreateBranch1765011919711 {
    constructor() {
        this.name = 'AddDeliveryForOrderAndCreateBranch1765011919711';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "branch" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" ADD "branchID" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "UQ_09de9f29e4ca39692bf9308bd06" UNIQUE ("branchID")`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "UQ_59ad2835d69dcdd147360713c62" UNIQUE ("itemID", "customerID")`);
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "UQ_0240e136b7fecc99d5256ebfa9a" UNIQUE ("customerID", "itemID")`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_09de9f29e4ca39692bf9308bd06" FOREIGN KEY ("branchID") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_09de9f29e4ca39692bf9308bd06"`);
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "UQ_0240e136b7fecc99d5256ebfa9a"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "UQ_59ad2835d69dcdd147360713c62"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryAt"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "UQ_09de9f29e4ca39692bf9308bd06"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "branchID"`);
        await queryRunner.query(`DROP TABLE "branch"`);
    }
}
exports.AddDeliveryForOrderAndCreateBranch1765011919711 = AddDeliveryForOrderAndCreateBranch1765011919711;
