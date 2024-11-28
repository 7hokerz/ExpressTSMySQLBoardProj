// 에러 클래스
export default class HttpError extends Error {
    status: number;

    constructor(status: number, message: string){
        super(message);
        this.status = status;
    }
}

