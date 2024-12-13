import { NextFunction, Request, Response } from "express";

export function ExcludeAsyncHandler(target: any, propertyKey: string) {
    Reflect.defineMetadata('exclude', true, target, propertyKey);
}

export function AsyncHandler<T extends { new (...args: any[]): {} }>(constructor: T) {
    const methodNames = Object.getOwnPropertyNames(constructor.prototype)
        .filter(name => name !== 'constructor'); // 모든 메서드 가져오기

    for (const methodName of methodNames) {
        const originalMethod = constructor.prototype[methodName];
        
        if(typeof originalMethod === 'function') {
            constructor.prototype[methodName] = async function ( // 원본 메서드 수정
                req: Request,
                res: Response,
                next: NextFunction,
            ) {
                try {
                    await originalMethod.apply(this, [req, res, next]);
                } catch (error) {
                    next(error);
                }
            }
        }
    }
}


/**
 * 비동기 함수에 대한 에러 처리 자동화 클래스 데코레이터
 * 
 * - try catch 중복 사용을 줄이고 가독성 향상
 * 
 * **prototype을 사용한 이유
 * 클래스 데코레이터의 경우 인스턴스가 생성되기 전에 클래스에 접근한다.
 * 따라서 객체가 아닌 클래스 원본, 즉 프로토타입에 접근하여
 * 클래스 속성이나 메서드를 수정한다.
 * 
 * - apply(thisArg, [argsArray])
 * thisArg: 현재의 this (즉, 자신이 속해있는 객체)를 지정
 * argsArray: 메서드의 파라미터(인자)로 전달할 값들을 배열로 지정
 * 
 * 
 */
