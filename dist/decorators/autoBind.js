"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = autoBind;
function autoBind(constructor) {
    const methodNames = Object.getOwnPropertyNames(constructor.prototype)
        .filter(name => name !== 'constructor'); // 모든 메서드 가져오기
    for (const methodName of methodNames) {
        const originalMethod = constructor.prototype[methodName];
        if (typeof originalMethod === 'function') {
            Object.defineProperty(constructor.prototype, methodName, {
                configurable: true,
                get() {
                    return originalMethod.bind(this); // `this` 바인딩
                },
            });
        }
    }
}
/**
 * this 바인딩 자동화 클래스 데코레이터
 *
 * - express 미들웨어 함수의 특성을 보완하기 위함.
 *
 * - 모든 메서드를 순회하면서 바인딩을 실시함.
 *
 * { new (...args: any[]): {} } : 클래스 생성자를 나타내는 타입
 *
 */
