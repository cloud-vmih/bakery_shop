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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const enum_1 = require("./enum/enum");
const OrderDetails_1 = require("./OrderDetails");
let Order = class Order extends typeorm_1.BaseEntity {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: "customerID" }),
    __metadata("design:type", User_1.User)
], Order.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, default: () => "NOW()" }),
    __metadata("design:type", Date)
], Order.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "deliveryAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enum_1.EOrderStatus,
        default: enum_1.EOrderStatus.PENDING,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderDetails_1.OrderDetail, od => od.order),
    __metadata("design:type", Array)
], Order.prototype, "orderDetails", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)("orders")
], Order);
