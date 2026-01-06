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
exports.OrderInfo = void 0;
const typeorm_1 = require("typeorm");
const Orders_1 = require("./Orders");
const Address_1 = require("./Address");
let OrderInfo = class OrderInfo extends typeorm_1.BaseEntity {
};
exports.OrderInfo = OrderInfo;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "orderID", type: "int" }),
    __metadata("design:type", Number)
], OrderInfo.prototype, "orderID", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Orders_1.Order),
    (0, typeorm_1.JoinColumn)({ name: "orderID" }),
    __metadata("design:type", Orders_1.Order)
], OrderInfo.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], OrderInfo.prototype, "cusName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], OrderInfo.prototype, "cusPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], OrderInfo.prototype, "cusGmail", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Address_1.Address),
    (0, typeorm_1.JoinColumn)({ name: "addressID" }),
    __metadata("design:type", Address_1.Address)
], OrderInfo.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrderInfo.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], OrderInfo.prototype, "branchId", void 0);
exports.OrderInfo = OrderInfo = __decorate([
    (0, typeorm_1.Entity)("orderInfo")
], OrderInfo);
