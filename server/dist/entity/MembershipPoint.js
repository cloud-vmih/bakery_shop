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
exports.MembershipPoint = void 0;
const typeorm_1 = require("typeorm");
const Customer_1 = require("./Customer");
let MembershipPoint = class MembershipPoint {
};
exports.MembershipPoint = MembershipPoint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MembershipPoint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, (user) => user.points),
    (0, typeorm_1.JoinColumn)({ name: "customerID" }),
    __metadata("design:type", Customer_1.Customer)
], MembershipPoint.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], MembershipPoint.prototype, "orderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], MembershipPoint.prototype, "earnedPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MembershipPoint.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], MembershipPoint.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MembershipPoint.prototype, "createdAt", void 0);
exports.MembershipPoint = MembershipPoint = __decorate([
    (0, typeorm_1.Entity)()
], MembershipPoint);
