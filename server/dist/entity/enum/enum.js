"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECategory = exports.EPayStatus = exports.EPayment = exports.ECakeType = exports.EOrderStatus = exports.ENotiType = void 0;
var ENotiType;
(function (ENotiType) {
    ENotiType["ORDER"] = "ORDER";
    ENotiType["SYSTEM"] = "SYSTEM";
    ENotiType["SUPPORT"] = "SUPPORT";
})(ENotiType || (exports.ENotiType = ENotiType = {}));
var EOrderStatus;
(function (EOrderStatus) {
    EOrderStatus["PENDING"] = "PENDING";
    EOrderStatus["CONFIRMED"] = "CONFIRMED";
    EOrderStatus["PREPARING"] = "PREPARING";
    EOrderStatus["DELIVERING"] = "DELIVERING";
    EOrderStatus["COMPLETED"] = "COMPLETED";
    EOrderStatus["CANCELED"] = "CANCELED";
})(EOrderStatus || (exports.EOrderStatus = EOrderStatus = {}));
var ECakeType;
(function (ECakeType) {
    ECakeType["CHESECAKE"] = "CHESECAKE";
    ECakeType["BIRTHDAYCAKE"] = "BIRTHDAYCAKE";
    ECakeType["MOUSE"] = "MOUSE";
})(ECakeType || (exports.ECakeType = ECakeType = {}));
var EPayment;
(function (EPayment) {
    EPayment["COD"] = "COD";
    EPayment["BANKING"] = "BANKING";
})(EPayment || (exports.EPayment = EPayment = {}));
var EPayStatus;
(function (EPayStatus) {
    EPayStatus["PENDING"] = "PENDING";
    EPayStatus["PAID"] = "PAID";
    EPayStatus["REFUNDED"] = "REFUNDED";
})(EPayStatus || (exports.EPayStatus = EPayStatus = {}));
var ECategory;
(function (ECategory) {
    ECategory["CAKE"] = "CAKE";
    ECategory["BREAD"] = "BREAD";
    ECategory["COOKIE"] = "COOKIE";
    ECategory["OTHER"] = "OTHER";
})(ECategory || (exports.ECategory = ECategory = {}));
