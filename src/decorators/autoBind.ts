// this 바인딩 자동화 데코레이터
export default function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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