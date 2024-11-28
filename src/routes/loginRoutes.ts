import express, { Request, Response } from 'express';
import { ExtendedReq } from '../types/request.types';
const router = express.Router();

import userController from '../controllers/userController';
import tokenController from '../controllers/tokenController';

router.route('/signup') //회원가입
    .get((req: Request, res: Response) => { res.render('signup'); })
    .post(userController.signup);

router.get('/withdraw', userController.withdraw); //회원탈퇴

router.route('/login') //로그인
    .get((req: ExtendedReq, res: Response) => {
        if(req.username) return res.redirect('/posts');
        res.render('login');
    })
    .post(userController.login);

router.get('/logout', userController.logout);

router.get('/refresh-token', tokenController.refreshToken);

export default router;

/*
    loginsignup.js의 주요 기능 설명
    - 회원가입 라우터: 
        GET: 회원가입 페이지 렌더링
        POST: 회원가입 정보 전달
    - 회원탈퇴 라우터: 회원탈퇴
    - 로그인 라우터: 
        GET: 로그인 페이지 렌더링
        POST: 로그인 정보 전달

    loginsignup.js 주요 편집 내용
    - cookie에 httpOnly 옵션을 추가하여 클라이언트에서 document.cookie의 명령으로 쿠키를 읽을 수 없도록 구현

    추후 수정 및 추가할 내용?
    - 아직 상관은 없으나 추후 쿠키에 secure 옵션을 넣어 https 전용 통신을 권장
    
*/