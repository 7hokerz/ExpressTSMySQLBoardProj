import { Request, Response, NextFunction } from "express";
import { CookieUtil } from "../utils/";
import { UserService, TokenService } from "../services";
import { AsyncHandler, autoBind } from "../decorators";
import { ExtendedReq } from '../utils/types-modules';
import env from "../config/index";

@autoBind
@AsyncHandler
export default class UserController {
    private userService: UserService = new UserService();
    private tokenService: TokenService = new TokenService();
    
    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {username, password} = req.body;
        await this.userService.signup(username, password);
        res.redirect('/login');
    }

    async withdraw(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        if(req.username && req.user_id){
            await this.userService.withdraw(req.user_id);
            await Promise.all([
                CookieUtil.manageCookie(req, res, env.cookie.user as string),
                CookieUtil.manageCookie(req, res, env.cookie.user2 as string),
            ]);
            res.status(200).json({
                ok: true,
            });
        } else {
            res.status(200).json({
                ok: false,
            });
        }
    }
    
    async login(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
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
    }

    async logout(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
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
            });
        }
    }

    async edit(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const newUser = req.body;
        const token = await this.userService.edit(req.username!, newUser);

        await Promise.all([
            CookieUtil.manageCookie(req, res, env.cookie.user as string, token.accessToken),
            CookieUtil.manageCookie(req, res, env.cookie.user2 as string, token.refreshToken)
        ]);
        res.redirect('/posts');
    }
     
    async renderUserInfoPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const user = await this.userService.renderUserPage(req.username!);
        res.render('userInfo', { user });
    }
 
    async renderEditPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const user = await this.userService.renderUserPage(req.username!);
        res.render('editPage', { username: user.username });
    }
}