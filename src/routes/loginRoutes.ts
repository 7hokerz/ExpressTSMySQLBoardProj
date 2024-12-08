import express, { Request, Response } from 'express';
import { ExtendedReq } from '../types/request.types';
import { UserController } from '../controllers';
import { TokenController } from '../controllers';

const router = express.Router();

const userController = new UserController();
const tokenController = new TokenController();

router.route('/signup') //회원가입
    .get((req: Request, res: Response) => { res.render('signup'); })
    .post(userController.signup);

router.get('/withdraw', userController.withdraw); //회원탈퇴

router.route('/login') //로그인
    .get((req: ExtendedReq, res: Response) => {
        if(req.username) return res.redirect('/posts');
        res.render('login');
    }) 
    .post(userController.login); // 로

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

    추후 수정 및 추가할 내용
    
*/