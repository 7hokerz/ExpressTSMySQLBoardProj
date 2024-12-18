import { ApiResponse } from "../interfaces";

export class ResponseHandler {
    static success<T>(data: T): ApiResponse<T> {
        return {
            success: true,
            data,
        };
    }

    static fail(message: string): ApiResponse<null> {
        return { 
            success: false,
            error: message,
        };
    }

    static error(message: string): ApiResponse<null> {
        return {
            success: false,
            error: message,
        };
    }
}