import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services';
import { CookieUtil } from '../utils';
import { AsyncWrapper, autoBind } from "../decorators";
import { UnauthorizedError } from '../errors';
import { inject, injectable } from 'tsyringe';

@injectable()
@autoBind
@AsyncWrapper
export default class TokenController {
    constructor(
        @inject(TokenService) private tokenService: TokenService
    ) {}

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const refreshToken = req.cookies[process.env.USER_COOKIE_KEY2 as string];
        
        if(!refreshToken) {
            throw new UnauthorizedError();
        }
        const { userId, username } = await this.tokenService.verifyToken(refreshToken as string);
        const { accessToken } = await this.tokenService.generateToken(userId, username, false);
        
        CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY as string, accessToken);
        CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY2 as string, refreshToken as string);
        res.redirect(req.query.nextlink as string);
    }
}