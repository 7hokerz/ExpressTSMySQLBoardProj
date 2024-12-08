import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services';
import { autoBind, CookieUtil } from '../utils/shared-modules';

export default class TokenController {
    private tokenService: TokenService = new TokenService();

    @autoBind
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const refreshToken = req.cookies[process.env.USER_COOKIE_KEY2 as string];
        try {
            if(!refreshToken) {
                res.status(401).send(`
                    <h1>You are not Logged In</h1>
                    <a href="/">Go Back</a>
                `);
                return;
            }
            const { userId, username } = await this.tokenService.verifyToken(refreshToken as string);
            const { accessToken } = await this.tokenService.generateToken(userId, username, false);
            
            CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY as string, accessToken);
            CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY2 as string, refreshToken as string);
            res.redirect(req.query.nextlink as string);
        } catch (error) {
            next(error);
        }
    }
}