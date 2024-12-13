import { HttpError } from "../errors";

export class Validation {
    static validUserInput(inputs: {value: string}[]): void {
        const regex = /^[a-zA-Z0-9\s*!]+$/;// 알파벳 및 공백, *, !만 허용
        
        for(const { value } of inputs){
            if(!regex.test(value)){
                throw new HttpError(400, `올바르지 않은 입력입니다.`);
            }
        }
    }
}