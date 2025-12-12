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
exports.Account = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const GoogleAccount_1 = require("./GoogleAccount");
const EmailVerification_1 = require("./EmailVerification");
let Account = class Account extends typeorm_1.BaseEntity {
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Account.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "char", length: 60 }),
    __metadata("design:type", String)
], Account.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => EmailVerification_1.EmailVerification, ev => ev.account),
    __metadata("design:type", EmailVerification_1.EmailVerification)
], Account.prototype, "emailVerification", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoogleAccount_1.GoogleAccount, ga => ga.account),
    __metadata("design:type", Array)
], Account.prototype, "googleAccounts", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, u => u.account),
    __metadata("design:type", User_1.User)
], Account.prototype, "user", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)("account")
], Account);
