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
exports.EmailVerification = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
let EmailVerification = class EmailVerification extends typeorm_1.BaseEntity {
};
exports.EmailVerification = EmailVerification;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "accountId" }),
    __metadata("design:type", Number)
], EmailVerification.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Account_1.Account, a => a.emailVerification, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "accountId" }),
    __metadata("design:type", Account_1.Account)
], EmailVerification.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], EmailVerification.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], EmailVerification.prototype, "verifiedAt", void 0);
exports.EmailVerification = EmailVerification = __decorate([
    (0, typeorm_1.Entity)("email_verification")
], EmailVerification);
