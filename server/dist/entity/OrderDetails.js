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
exports.OrderDetail = void 0;
const typeorm_1 = require("typeorm");
const Orders_1 = require("./Orders");
let OrderDetail = class OrderDetail extends typeorm_1.BaseEntity {
};
exports.OrderDetail = OrderDetail;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "orderID", type: "bigint" }),
    __metadata("design:type", Number)
], OrderDetail.prototype, "orderID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Orders_1.Order, (o) => o.orderDetails),
    (0, typeorm_1.JoinColumn)({ name: "orderID" }),
    __metadata("design:type", Orders_1.Order)
], OrderDetail.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], OrderDetail.prototype, "itemInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrderDetail.prototype, "note", void 0);
exports.OrderDetail = OrderDetail = __decorate([
    (0, typeorm_1.Entity)("orderDetail")
], OrderDetail);
