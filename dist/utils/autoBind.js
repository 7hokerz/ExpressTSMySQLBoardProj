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
    _(클래스 생성자) 및 _2(메서드 이름)는 쓰지 않는 파라미터
    configurable: 프로퍼티의 특성에 대한 변경/삭제 가능 유무
 */ 
