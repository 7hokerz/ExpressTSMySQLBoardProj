import { Request, Response, NextFunction } from "express";
import { autoBind, CookieUtil } from "../utils/shared-modules";
import { ExtendedReq } from '../utils/types-modules';
import { UserService, TokenService } from "../services";
import env from "../config/index";

export default class UserController {
    private userService: UserService = new UserService();
    private tokenService: TokenService = new TokenService();
    
    @autoBind 
    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {username, password} = req.body;
            await this.userService.signup(username, password);
            res.redirect('/login');
        } catch (error) {
            next(error);
        }
    }

    @autoBind
    async withdraw(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        if(req.username && req.user_id){
            await this.userService.withdraw(req.user_id);
            CookieUtil.manageCookie(req, res, env.cookie.user as string);
            CookieUtil.manageCookie(req, res, env.cookie.user2 as string);
        }
        res.status(200).json({
            ok: true,
        })
    }
    
    @autoBind
    async login(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;
            const data = await this.userService.login(username, atob(password));
            const Token = await this.tokenService.generateToken(data.user_id, username, true);

            await Promise.all([
                CookieUtil.manageCookie(req, res, env.cookie.user as string, Token.accessToken),
                CookieUtil.manageCookie(req, res, env.cookie.user2 as string, Token.refreshToken),
            ]);
            res.status(200).json({
                ok: true
            });
        } catch (error) {
            next(error);
        }
    }

    @autoBind
    async logout(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            if(req.username && req.user_id){
                await this.userService.logout(req.user_id);
                await Promise.all([
                    CookieUtil.manageCookie(req, res, env.cookie.user as string),
                    CookieUtil.manageCookie(req, res, env.cookie.user2 as string),
                ]);
                res.status(200).json({
                    ok: true,
                })
            } else {
                res.status(200).json({
                    ok: false,
                })
            }
        } catch (error) {
            next(error);
        }
    }
    
    @autoBind 
    async renderUserInfoPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.renderUserPage(req.username!);
            res.render('userInfo', { user });
        } catch (error) {
            next(error);
        }
    }

    @autoBind 
    async renderEditPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.renderUserPage(req.username!);
            res.render('editPage', { username: user.username });
        } catch (error) {
            next(error);
        }
    }

    @autoBind   
    async edit(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const newUser = req.body;
            const token = await this.userService.edit(req.username!, newUser);

            await Promise.all([
                CookieUtil.manageCookie(req, res, env.cookie.user as string, token.accessToken),
                CookieUtil.manageCookie(req, res, env.cookie.user2 as string, token.refreshToken)
            ]);
            res.redirect('/posts');
        } catch (error) {
            next(error);
        }
    }
}