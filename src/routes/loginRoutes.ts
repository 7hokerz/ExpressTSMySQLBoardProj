import express, { Request, Response } from 'express';
import { ExtendedReq } from '../types/request.types';
import { UserController } from '../controllers';
import { TokenController } from '../controllers';
import { AuthMiddleware } from '../utils/shared-modules';

const router = express.Router();

const auth = new AuthMiddleware();
const userController = new UserController();
const tokenController = new TokenController();

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