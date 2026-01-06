"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAccount = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
let GoogleAccount = class GoogleAccount extends typeorm_1.BaseEntity {
};
exports.GoogleAccount = GoogleAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GoogleAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GoogleAccount.prototype, "provider_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GoogleAccount.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, a => a.googleAccounts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "account_id" }),
    __metadata("design:type", Account_1.Account)
], GoogleAccount.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, default: () => "NOW()" }),
    __metadata("design:type", Date)
], GoogleAccount.prototype, "createdAt", void 0);
exports.GoogleAccount = GoogleAccount = __decorate([
    (0, typeorm_1.Entity)("google_account")
], GoogleAccount);
