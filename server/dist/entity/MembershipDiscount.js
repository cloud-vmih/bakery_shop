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
exports.MembershipDiscount = void 0;
const typeorm_1 = require("typeorm");
const Item_1 = require("./Item");
let MembershipDiscount = class MembershipDiscount {
};
exports.MembershipDiscount = MembershipDiscount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MembershipDiscount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MembershipDiscount.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], MembershipDiscount.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], MembershipDiscount.prototype, "minPoints", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Item_1.Item, (i) => i.membershipDiscounts, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: "membership_discount_items" }),
    __metadata("design:type", Array)
], MembershipDiscount.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], MembershipDiscount.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], MembershipDiscount.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MembershipDiscount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MembershipDiscount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MembershipDiscount.prototype, "updatedAt", void 0);
exports.MembershipDiscount = MembershipDiscount = __decorate([
    (0, typeorm_1.Entity)("membership_discounts")
], MembershipDiscount);
