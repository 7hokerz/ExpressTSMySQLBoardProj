"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = autobind;
/**
 * this 바인딩 자동화 데코레이터
 * @param {any} _
 * @param {string} _2 - 멤버의 이름
 * @param {PropertyDescriptor} descriptor - 프로퍼티 설명자: 프로퍼티 값과 3가지 프로퍼티 플래그
 * @returns
 */
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    return {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
}
