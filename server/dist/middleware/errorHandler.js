"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Lỗi máy chủ';
    console.error(`[${req.method} ${req.path}]`, err); // log đầy đủ
    res.status(status).json({
        error: message,
    });
};
exports.errorHandler = errorHandler;
