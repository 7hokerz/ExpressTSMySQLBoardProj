"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    static success(data) {
        return {
            success: true,
            data,
        };
    }
    static fail(message) {
        return {
            success: false,
            error: message,
        };
    }
    static error(message) {
        return {
            success: false,
            error: message,
        };
    }
}
exports.ResponseHandler = ResponseHandler;
