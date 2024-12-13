// 에러 클래스
export default class HttpError extends Error {
    statusCode: number;

    constructor(status: number, message: string){
        super(message);
        this.statusCode = status;
    }
}

