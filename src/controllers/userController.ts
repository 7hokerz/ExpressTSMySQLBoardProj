import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { AsyncWrapper, autoBind } from "../decorators";
import { CookieUtil } from "../utils/";
import { UserService, TokenService } from "../services";
import { ExtendedReq } from '../interfaces';
import { ResponseHandler } from "../middlewares";
import env from "../config/index";
import { UnauthorizedError } from "../errors";
import { validateOrReject } from "class-validator";
import { UserRequestDto } from "../domain/entities";


@injectable()
@autoBind
@AsyncWrapper
export default class UserController {
    constructor(
        @inject(TokenService) private tokenService: TokenService,
        @inject(UserService) private userService: UserService
    ) {}

    // 타입 가드 사용
    private typeGuardAuth<T extends number | string>(param: T | undefined): asserts param is T {
        if(!param) {
            throw new UnauthorizedError();
        }
    }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, password } = req.body;
        const userReq = new UserRequestDto(username, atob(password));
        await validateOrReject(userReq); // 조건 불만족 시 오류 반환

        await this.userService.signup(userReq);
        res.status(200).json(ResponseHandler.success(null));
    }

    async withdraw(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        this.typeGuardAuth(req.user_id);
        
        await this.userService.withdraw(req.user_id);
        await Promise.all([
            CookieUtil.manageCookie(req, res, env.cookie.user as string),
            CookieUtil.manageCookie(req, res, env.cookie.user2 as string),
        ]);
        res.status(200).json(ResponseHandler.success(null));
    }
    
    async login(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const { username, password } = req.body;
        const userReq = new UserRequestDto(username, atob(password));
        await validateOrReject(userReq); // 조건 불만족 시 오류 반환

        const data = await this.userService.login(userReq);
        const Token = await this.tokenService.generateToken(data.user_id, username, true);

        await Promise.all([
            CookieUtil.manageCookie(req, res, env.cookie.user as string, Token.accessToken),
            CookieUtil.manageCookie(req, res, env.cookie.user2 as string, Token.refreshToken),
        ]);
        res.status(200).json(ResponseHandler.success(null));
    }

    async logout(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        this.typeGuardAuth(req.user_id);

        await this.userService.logout(req.user_id);
        await Promise.all([
            CookieUtil.manageCookie(req, res, env.cookie.user as string),
            CookieUtil.manageCookie(req, res, env.cookie.user2 as string),
        ]);
        res.status(200).json(ResponseHandler.success(null));
    }

    async edit(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        this.typeGuardAuth(req.username);

        const { username, curPw, password } = req.body;
        const newUserReq = new UserRequestDto(username, password);
        const currentUserReq = new UserRequestDto(req.username, curPw);
        
        await validateOrReject(newUserReq); // 조건 불만족 시 오류 반환
        await validateOrReject(currentUserReq);

        const token = await this.userService.edit(currentUserReq, newUserReq);

        await Promise.all([
            CookieUtil.manageCookie(req, res, env.cookie.user as string, token.accessToken),
            CookieUtil.manageCookie(req, res, env.cookie.user2 as string, token.refreshToken)
        ]);
        res.redirect('/posts');
    }
     
    async renderUserInfoPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        this.typeGuardAuth(req.username);
        const user = await this.userService.renderUserPage(req.username);
        res.render('userInfo', { user });
    }
 
    async renderEditPage(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        this.typeGuardAuth(req.username);
        const user = await this.userService.renderUserPage(req.username);
        res.render('editPage', { username: user.username });
    }
}