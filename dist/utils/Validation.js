"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const shared_modules_1 = require("./shared-modules");
class Validation {
    static validUserInput(inputs) {
        const regex = /^[a-zA-Z0-9\s*!]+$/; // 알파벳 및 공백, *, !만 허용
        for (const { value } of inputs) {
            if (!regex.test(value)) {
                throw new shared_modules_1.HttpError(400, `올바르지 않은 입력입니다.`);
            }
        }
    }
}
exports.Validation = Validation;
