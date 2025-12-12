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
exports.Wishlist = void 0;
const typeorm_1 = require("typeorm");
const Item_1 = require("./Item");
const Customer_1 = require("./Customer");
let Wishlist = class Wishlist extends typeorm_1.BaseEntity {
};
exports.Wishlist = Wishlist;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "customerID", type: "bigint" }),
    __metadata("design:type", Number)
], Wishlist.prototype, "customerID", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "itemID", type: "bigint" }),
    __metadata("design:type", Number)
], Wishlist.prototype, "itemID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, c => c.wishlist),
    (0, typeorm_1.JoinColumn)({ name: "customerID" }),
    __metadata("design:type", Customer_1.Customer)
], Wishlist.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Item_1.Item, i => i.wishlist),
    (0, typeorm_1.JoinColumn)({ name: "itemID" }),
    __metadata("design:type", Array)
], Wishlist.prototype, "item", void 0);
exports.Wishlist = Wishlist = __decorate([
    (0, typeorm_1.Entity)("wishlist"),
    (0, typeorm_1.Unique)(["customerID", "itemID"])
], Wishlist);
