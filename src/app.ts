import dotenv from 'dotenv'; // 타입 및 모듈, 미들웨어 등 임포트
import 'reflect-metadata';
import rateLimit from 'express-rate-limit';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import configExpress from './config/express';
import { errorHandler, AuthMiddleware } from './utils/shared-modules';
import { ExtendedReq } from './utils/types-modules';
import routes from './routes';
dotenv.config();
import test from './test';

//일정 횟수가 초과하면 오류 메시지 전송
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: "요청 횟수 초과.",
});

const auth = new AuthMiddleware();

const app: Express = express();

configExpress(app);

app.use(auth.cookieAuth);// 토큰을 해석하여 body에 삽입
//app.use(limiter);

//app.use('/test', test);

app.use('/', routes.login);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/posts', auth.requireAuth, routes.posts);
app.use('/user', auth.requireAuth, routes.userInfo);

app.get('/', async (req: ExtendedReq, res: Response) => { 
    if(req.username){
        return res.redirect('/posts');
    }
    res.redirect('login');
});

app.get('*', (req: Request, res: Response) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});

app.use(errorHandler);

export default app;
/*
    - 메인 서버 미들웨어로서 주요 서버에 대한 설정을 적용 및 라우터 지정
        

    + return 문이 존재하지 않으면 밑의 코드가 실행되어 오류가 발생한다. 
    이유는 redirect로 응답을 보냈으나, send로 또 응답을 보내려 하기 때문...
*/