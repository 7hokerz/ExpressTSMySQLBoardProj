import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';

export default function (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    if(err instanceof HttpError) {
        const { statusCode, message, stack } = err;

        console.error(`Error occurred: ${message}`, {
            stack,
            statusCode,
        });
        res.status(statusCode);
    
        if (req.accepts('html')) {
            res.send(`
                <h1>상태 코드: ${statusCode}</h1>
                <h1>메시지: ${message}</h1>
            `);
        } else if (req.accepts('json')){
            res.json({
                error:{
                    message
                }
            });
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
            `);
        } else if (req.accepts('json')){
            res.json({
                error: {
                    message: 'Internal Server Error',
                },
            });
        }
        else {
            res.type('txt').send(`Error: 500\nMessage: Internal Server Error`);
        }
    }
};
/**
 * 
 * 
 * 
 * 
 */