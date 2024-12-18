"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TransactionError_errorDetail;
Object.defineProperty(exports, "__esModule", { value: true });
// 트랜잭션 에러 클래스
class TransactionError extends Error {
    constructor(message, errorDetail) {
        super(message);
        _TransactionError_errorDetail.set(this, void 0);
        __classPrivateFieldSet(this, _TransactionError_errorDetail, errorDetail, "f");
    }
    getErrorDetail() {
        return __classPrivateFieldGet(this, _TransactionError_errorDetail, "f");
    }
}
_TransactionError_errorDetail = new WeakMap();
exports.default = TransactionError;
