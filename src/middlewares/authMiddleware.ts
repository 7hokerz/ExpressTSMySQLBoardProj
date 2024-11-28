import { Request, Response, NextFunction } from 'express';
import { jwtToken, autoBind } from '../utils/shared-modules';
import { ExtendedReq } from '../utils/types-modules';

export default class AuthMiddleware {
    #jwtService: jwtToken;
    private readonly userCookieKey: string;
    private readonly userCookieKey2: string;

    constructor() {
        this.#jwtService = new jwtToken();
        this.userCookieKey = process.env.USER_COOKIE_KEY!;
        this.userCookieKey2 = process.env.USER_COOKIE_KEY2!;
    }
    
    public requireAuth(req: ExtendedReq, res: Response, next: NextFunction): void {
        if(!req.username){
            res.status(401).send(`
                <h1>You are not Logged In</h1>
                <a href="/">Go Back</a>
            `);
            return;
        }
        next();
    }

    public regCheck(username: string, password: string): boolean {
        const regex = /^[a-zA-Z0-9\s*!]+$/;//알파벳 및 공백, *, !만 허용
        return (regex.test(username) && regex.test(password));
    }

    @autoBind
    public cookieAuth(req: ExtendedReq, res: Response, next: NextFunction): void {
        if(req.path == '/refresh-token'){
            return next();
        }
        const token = req.cookies[this.userCookieKey];
        
        if(token) {
            const payload = this.#jwtService.verifyAccessToken(token);
            
            if(payload && payload.username !== null){
                req.username = payload.username;
                req.user_id = payload.id;
            }
            else {
                const refreshtoken = req.cookies[this.userCookieKey2];
                if(refreshtoken){
                    return res.redirect('/refresh-token');
                }
            }
        }
        next();
    }
}
/*
    쿠키로부터 토큰을 획득하여,
    토큰을 검증하고 원본을 변환한다.
    이때 토큰이 만료된 경우 쿠키에 저장된 리프레시 토큰을 검증한다.
    리프레시 토큰이 존재하면 이를 이용하여 액세스 토큰을 재발급 받는다.
*/

/*
    auth.js의 주요 기능 설명
    - requireAuth(): req.username 존재를 검증하는 접근 제어 미들웨어
    - regCheck(): 정규식을 이용하여 문자열 검증
    - cookieCheck(): 쿠키를 복호화
        쿠키를 검증하여 username, id를 req 객체에 담는다.

    auth.js 주요 편집 내용
    - 

    추후 수정 및 추가할 내용?
    - 

*/