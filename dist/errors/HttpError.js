"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 에러 클래스
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.default = HttpError;
