import { Request, Response, NextFunction } from 'express';
import { TransactionError } from "../utils/shared-modules";

export default function (err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.status || 500;
    if(err instanceof TransactionError) console.log(err.getErrorDetail());
    else console.log(err);
    
    res.status(statusCode).send(err.message);
};