"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = autobind;
// this 바인딩 자동화 데코레이터
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    return {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
}
/*
    express에서 미들웨어 함수를 쓸 때
    this 바인딩을 자동으로 해주는 역할
 */ 
