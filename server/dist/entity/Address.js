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
exports.Address = void 0;
const typeorm_1 = require("typeorm");
const Customer_1 = require("./Customer");
const Branch_1 = require("./Branch");
let Address = class Address extends typeorm_1.BaseEntity {
};
exports.Address = Address;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Address.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Address.prototype, "placeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, c => c.addresses),
    (0, typeorm_1.JoinColumn)({ name: "customerID" }),
    __metadata("design:type", Customer_1.Customer)
], Address.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Branch_1.Branch, b => b.address, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "branchID" }),
    __metadata("design:type", Branch_1.Branch)
], Address.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Address.prototype, "fullAddress", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Address.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Address.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Address.prototype, "isDefault", void 0);
exports.Address = Address = __decorate([
    (0, typeorm_1.Entity)("address"),
    (0, typeorm_1.Index)(["customer", "placeId"], { unique: true })
], Address);
