import dotenv from 'dotenv'; // 타입 및 모듈, 미들웨어 등 임포트
import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import { container } from 'tsyringe';
import configExpress from './config/express';
import { errorHandler, AuthMiddleware, validationErrorHandler } from './middlewares';
import { ExtendedReq } from './interfaces';
import routes from './routes';
dotenv.config();
import test from './test';

const auth = container.resolve(AuthMiddleware);

const app: Express = express();

configExpress(app);

app.use(auth.cookieAuth);// 토큰을 해석하여 body에 삽입

app.use('/', routes.login);
app.use('/posts', auth.requireAuth, routes.posts);
app.use('/user', auth.requireAuth, routes.userInfo);

app.get('/', async (req: ExtendedReq, res: Response) => { 
    if(req.username) res.redirect('/posts');
    else res.redirect('/login');
});

app.get('*', (req: Request, res: Response) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});

// 에러 미들웨어
app.use(validationErrorHandler);
app.use(errorHandler);

export default app;
