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

    // 타입 가드 사용
    private typeGuardAuth<T extends number | string>(param: T | undefined): asserts param is T {
        if(!param) {
            throw new UnauthorizedError();
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const refreshToken = req.cookies[process.env.USER_COOKIE_KEY2 as string];

        this.typeGuardAuth<string>(refreshToken);
        
        const { userId, username } = await this.tokenService.verifyToken(refreshToken);
        const { accessToken } = await this.tokenService.generateToken(userId, username, false);
        
        CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY as string, accessToken);
        CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY2 as string, refreshToken);
        res.redirect(req.query.nextlink as string);
    }
}