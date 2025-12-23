"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsDefaultToAddress1766216743244 = void 0;
class AddIsDefaultToAddress1766216743244 {
    constructor() {
        this.name = 'AddIsDefaultToAddress1766216743244';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" ADD "isDefault" boolean NOT NULL DEFAULT true`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "isDefault"`);
    }
}
exports.AddIsDefaultToAddress1766216743244 = AddIsDefaultToAddress1766216743244;
