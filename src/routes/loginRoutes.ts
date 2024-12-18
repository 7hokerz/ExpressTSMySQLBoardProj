import express, { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ExtendedReq } from '../types/request.types';
import { UserController, TokenController } from '../controllers';
import { AuthMiddleware } from '../middlewares';

const router = express.Router();

const auth = container.resolve(AuthMiddleware);
const userController = container.resolve(UserController);
const tokenController = container.resolve(TokenController);

router.route('/signup') //회원가입
    .get((req: Request, res: Response) => { res.render('signup'); })
    .post(userController.signup);

router.get('/withdraw', auth.requireAuth, userController.withdraw); //회원탈퇴

router.route('/login') //로그인
    .get((req: ExtendedReq, res: Response) => {
        if(req.username) return res.redirect('/posts');
        res.render('login');
    }) 
    .post(userController.login); // 로

router.get('/logout', auth.requireAuth, userController.logout);

router.get('/refresh-token', tokenController.refreshToken);

export default router;

/**
 * 
 * 
 * 
 * 
 */