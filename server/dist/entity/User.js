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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const Account_1 = require("./Account");
const Message_1 = require("./Message");
const Notification_1 = require("./Notification");
let User = class User extends typeorm_1.BaseEntity {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Account_1.Account, a => a.user, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    }),
    (0, typeorm_2.JoinColumn)({ name: "accountID" }),
    __metadata("design:type", Account_1.Account)
], User.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatarURL", void 0);
__decorate([
    (0, typeorm_2.CreateDateColumn)({ name: "joinAt" }),
    __metadata("design:type", Date)
], User.prototype, "joinAt", void 0);
__decorate([
    (0, typeorm_2.OneToMany)(() => Message_1.Message, msg => msg.sender),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Notification_1.Notification, noti => noti.users),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "user" }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("users"),
    (0, typeorm_1.TableInheritance)({ column: { type: "varchar", name: "type" } })
], User);
