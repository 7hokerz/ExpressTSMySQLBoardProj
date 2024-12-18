import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors';
import { ResponseHandler } from './responseHandler';
import { ValidationError } from 'class-validator';

export function errorHandler(
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    if(err instanceof BaseError) {
        const { statusCode, message, stack } = err;
        console.error(`Error occurred: ${message}`, {
            stack,
            statusCode,
        });
        res.status(statusCode)

        if (req.accepts('html')) {
            res.send(`
                <h1>상태 코드: ${statusCode}</h1>
                <h1>메시지: ${message}</h1>
                <a href="/login">돌아가기</a>
            `);
        } else if (req.accepts('json')){
            res.json(ResponseHandler.error(message));
        } else {
            res.type('txt').send(`Error: ${statusCode}\nMessage: ${message}`);
        }
    } else {
        console.error(`Unexpected error: ${err.message}`, { stack: err.stack });

        res.status(500);

        if (req.accepts('html')) {
            res.send(`
                <h1>상태 코드: 500</h1>
                <h1>메시지: Internal Server Error</h1>
                <a href="/login">돌아가기</a>
            `);
        } else if (req.accepts('json')){
            res.json(ResponseHandler.error('Internal Server Error'));
        }
        else {
            res.type('txt').send(`Error: 500\nMessage: Internal Server Error`);
        }
    }
};

export function validationErrorHandler(
    err: ValidationError[] | Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    //
    if (Array.isArray(err) && err[0] instanceof ValidationError) {
        console.error(err);
        res.status(400).json(ResponseHandler.error('Validation Error'));
        return;
    }
    next(err);
}
/**
 * ValidationError는 별도의 형태를 가진다.
 * 배열 안에 객체가 들어있는 구조다.
 * 따라서 별도로 미들웨어를 추가로 만들어서 처리해야 한다.
 * 
 * 흐름
 * - throw error => ValidationErrorHandler => ErrorHandler
 * 
 */