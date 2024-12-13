import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services';
import { CookieUtil } from '../utils';
import { AsyncHandler, autoBind } from "../decorators";
import { HttpError } from '../errors';

@autoBind
@AsyncHandler
export default class TokenController {
    private tokenService: TokenService = new TokenService();

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const refreshToken = req.cookies[process.env.USER_COOKIE_KEY2 as string];
        
        if(!refreshToken) {
            throw new HttpError(401, '이 페이지를 볼 권한이 없습니다.');
        }
        const { userId, username } = await this.tokenService.verifyToken(refreshToken as string);
        const { accessToken } = await this.tokenService.generateToken(userId, username, false);
        
        CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY as string, accessToken);
        CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY2 as string, refreshToken as string);
        res.redirect(req.query.nextlink as string);
    }
}