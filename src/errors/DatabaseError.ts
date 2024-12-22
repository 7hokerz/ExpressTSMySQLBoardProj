import { BaseError } from "./BaseError";

export class DatabaseError extends BaseError {
    statusCode = 500;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}