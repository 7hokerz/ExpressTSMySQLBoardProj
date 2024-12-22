import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class UnauthorizedError extends BaseError {
    statusCode = 401;

    constructor() {
        super('Not authorized');
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class NotFoundError extends BaseError {
    statusCode = 404;

    constructor(public resource: string) {
        super(`${resource} not found`);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}