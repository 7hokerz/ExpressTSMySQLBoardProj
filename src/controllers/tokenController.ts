import { CookieOptions, NextFunction, Request, Response } from 'express';
import tokenService from '../services/tokenService';
import { autoBind } from '../utils/shared-modules';

class tokenController {
    @autoBind
    async refreshToken(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.cookies[process.env.USER_COOKIE_KEY2 as string];
        try {
            const { userId, username } = await tokenService.verifyToken(refreshToken as string);
            const { accessToken } = await tokenService.generateToken(userId, username, false);
            
            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY as string, accessToken);
            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2 as string, refreshToken as string);
            res.redirect('/posts');
        } catch (error) {
            next(error);
        }
    }

    private CookieHandler(
        req: Request, 
        res: Response, 
        key: string,
        token?: string, 
        options?: CookieOptions
    ): void {
        if(req.cookies[key]) {
            res.clearCookie(key);
        }// 옵션 추가도 가능하도록 설계
        if(token) {
            res.cookie(key, token, {
                httpOnly: true, 
                expires: new Date(Date.now() + 3600000),
                sameSite: 'lax',
                ...options
            });
        }
    }
}

export default new tokenController();