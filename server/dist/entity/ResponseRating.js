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
exports.ResponseRating = void 0;
const typeorm_1 = require("typeorm");
const Rating_1 = require("./Rating");
const Staff_1 = require("./Staff");
const Admin_1 = require("./Admin");
let ResponseRating = class ResponseRating extends typeorm_1.BaseEntity {
};
exports.ResponseRating = ResponseRating;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ResponseRating.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Rating_1.Rating, r => r.responses, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "ratingId" }),
    __metadata("design:type", Rating_1.Rating)
], ResponseRating.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Staff_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: "staffID" }),
    __metadata("design:type", Staff_1.Staff)
], ResponseRating.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Admin_1.Admin, (a) => a.responses),
    (0, typeorm_1.JoinColumn)({ name: "adminID" }),
    __metadata("design:type", Admin_1.Admin)
], ResponseRating.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResponseRating.prototype, "contents", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", Date)
], ResponseRating.prototype, "createAt", void 0);
exports.ResponseRating = ResponseRating = __decorate([
    (0, typeorm_1.Entity)("responseRating")
], ResponseRating);
