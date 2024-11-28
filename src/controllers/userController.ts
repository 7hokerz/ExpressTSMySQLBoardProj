import { Request, Response, NextFunction, CookieOptions } from "express";
import { AuthMiddleware, HttpError } from "../utils/shared-modules";
import { autoBind } from '../utils/shared-modules';
import userService from "../services/userService";
import { ExtendedReq } from '../utils/types-modules';
import tokenService from "../services/tokenService";

class userController{
    #authMiddleware: AuthMiddleware;

    constructor() {
        this.#authMiddleware = new AuthMiddleware();
    }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {username, password} = req.body;
            await userService.signup(username, password);
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    @autoBind
    async withdraw(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        if(req.username && req.user_id){
            await userService.withdraw(req.user_id);
            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY as string);
            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2 as string);
        }
        res.redirect('/');
    }
    
    @autoBind
    async login(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;
            const user_id = await userService.login(username, password);
            const Token = await tokenService.generateToken(user_id, username, true);

            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY as string, Token.accessToken);
            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2 as string, Token.refreshToken);
            res.redirect('/posts');
        } catch (error) {
            next(error);
        }
    }

    @autoBind
    async logout(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            if(req.username && req.user_id){
                await userService.logout(req.user_id);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY as string);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2 as string);
            }
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    async renderUserInfoPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await userService.renderUserPage(req.username!);
            res.render('userInfo', { user });
        } catch (error) {
            next(error);
        }
    }

    async renderEditPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await userService.renderUserPage(req.username!);
            res.render('editPage', {username: user.username});
        } catch (error) {
            next(error);
        }
    }

    @autoBind   
    async edit(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const newUser = req.body;
            if(!this.#authMiddleware.regCheck(newUser.username, newUser.password)){// 유효성 검증
                throw new HttpError(400, `올바르지 않은 입력입니다.`);
            }
            const token = await userService.edit(req.username!, newUser);

            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY as string, token.accessToken);
            this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2 as string, token.refreshToken);
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

export default new userController();