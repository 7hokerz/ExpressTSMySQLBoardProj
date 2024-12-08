import NodeCache from 'node-cache';
import { Response, NextFunction } from 'express';
import { jwtToken, autoBind } from '../utils/shared-modules';
import { ExtendedReq } from '../utils/types-modules';

export default class AuthMiddleware {
    private readonly memoryCache: NodeCache;
    private readonly jwtService: jwtToken = new jwtToken();
    private readonly userCookieKey: string = process.env.USER_COOKIE_KEY!;
    private readonly userCookieKey2: string = process.env.USER_COOKIE_KEY2!
    private readonly CACHE_DURATION = 15 * 60; // 15분

    constructor() {
        this.memoryCache = new NodeCache({
            stdTTL: this.CACHE_DURATION, // 캐시 항목 기본 만료 시간
            checkperiod: this.CACHE_DURATION + 10, // 캐시 만료 검사 주기
        });
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

    @autoBind
    public cookieAuth(req: ExtendedReq, res: Response, next: NextFunction): void {
        if (req.path === '/refresh-token') return next();
        
        const token = req.cookies[this.userCookieKey];

        if(!token) return next();
        
        const cacheUser = this.memoryCache.get(token); // 캐시 조회

        if(cacheUser) {
            const userInfo = cacheUser as { username: string, id: number };
            req.username = userInfo.username; 
            req.user_id = userInfo.id;
            return next();
        }

        try {
            const payload = this.jwtService.verifyAccessToken(token);
        
            if(payload && payload.username){
                this.memoryCache.set(token, { // 캐시 설정
                    username: payload.username,
                    id: payload.id
                });

                req.username = payload.username;
                req.user_id = payload.id;
            }
        } catch (error) {
            if(req.cookies[this.userCookieKey2]){
                res.redirect('/refresh-token?nextlink='+ req.path);
                return;
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