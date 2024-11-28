// 트랜잭션 에러 클래스
export default class TransactionError extends Error {
    #errorDetail;

    constructor(message: string, errorDetail: InstanceType<typeof Error>){
        super(message);
        this.#errorDetail = errorDetail;
    }

    getErrorDetail(){
        return this.#errorDetail;
    }
}