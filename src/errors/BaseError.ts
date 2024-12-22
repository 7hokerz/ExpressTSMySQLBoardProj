
export abstract class BaseError extends Error {
    abstract statusCode: number;
    constructor(public message: string){
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}

/**
 * 왜 setPrototypeOf를 써야 하는가?
 * 
 * 일반적인 클래스의 경우 객체가 생성되고, 이 객체의 this를 
 * 하위 클래스의 프로토타입에 자동으로 바인딩하기 때문에 문제 없음.
 * 
 * Error 클래스의 "특성"으로 인한 문제임.
 * 
 * Error 생성자는 새로운 객체를 생성 후 this를 덮어쓴다.
 * 
 * 따라서 프로토타입 체인이 Error.prototype으로 설정되는데 
 * 즉 하위 클래스의 프로토타입 체인이 손실된다.
 * 
 * 
 * 
 */