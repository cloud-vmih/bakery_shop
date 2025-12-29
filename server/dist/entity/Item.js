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
exports.Item = void 0;
const typeorm_1 = require("typeorm");
const enum_1 = require("./enum/enum");
const Wishlist_1 = require("./Wishlist");
const Rating_1 = require("./Rating");
const ItemDiscount_1 = require("./ItemDiscount");
const Inventory_1 = require("./Inventory");
let Item = class Item extends typeorm_1.BaseEntity {
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Item.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "imageURL", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enum_1.ECategory,
        nullable: true,
    }),
    __metadata("design:type", String)
], Item.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], Item.prototype, "itemDetail", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Wishlist_1.Wishlist, w => w.item),
    __metadata("design:type", Array)
], Item.prototype, "wishlists", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Rating_1.Rating, (r) => r.item),
    __metadata("design:type", Array)
], Item.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Inventory_1.Inventory, (i) => i.item),
    __metadata("design:type", Array)
], Item.prototype, "inventory", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ItemDiscount_1.ItemsDiscount, (i) => i.items),
    __metadata("design:type", Array)
], Item.prototype, "discounts", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)("item")
], Item);
