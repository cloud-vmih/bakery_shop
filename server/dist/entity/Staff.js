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
exports.Staff = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const typeorm_2 = require("typeorm");
const ResponseRating_1 = require("./ResponseRating");
let Staff = class Staff extends User_1.User {
};
exports.Staff = Staff;
__decorate([
    (0, typeorm_2.OneToMany)(() => ResponseRating_1.ResponseRating, rr => rr.staff),
    __metadata("design:type", ResponseRating_1.ResponseRating)
], Staff.prototype, "response", void 0);
__decorate([
    (0, typeorm_2.Column)({
        type: "enum",
        enum: ["active", "locked"],
        default: "active",
    }),
    __metadata("design:type", String)
], Staff.prototype, "status", void 0);
exports.Staff = Staff = __decorate([
    (0, typeorm_1.ChildEntity)()
], Staff);
