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
exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const Orders_1 = require("./Orders");
const enum_1 = require("./enum/enum");
let Payment = class Payment extends typeorm_1.BaseEntity {
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Orders_1.Order),
    (0, typeorm_1.JoinColumn)({ name: "orderID" }),
    __metadata("design:type", Orders_1.Order)
], Payment.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, default: () => "NOW()" }),
    __metadata("design:type", Date)
], Payment.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enum_1.EPayStatus,
        default: enum_1.EPayStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enum_1.EPayment,
        default: enum_1.EPayment.COD,
    }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)("payment")
], Payment);
