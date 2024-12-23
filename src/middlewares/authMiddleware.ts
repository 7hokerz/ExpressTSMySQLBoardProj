import NodeCache from 'node-cache';
import { Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { TokenUtil } from '../utils/';
import { autoBind } from '../decorators';
import { ExtendedReq } from '../interfaces';
import env from '../config';
import { UnauthorizedError } from '../errors';

@injectable()
@autoBind
export default class AuthMiddleware {
    private readonly memoryCache: NodeCache;
    private readonly userCookieKey: string = env.cookie.user!;
    private readonly userCookieKey2: string = env.cookie.user2!
    private readonly CACHE_DURATION = 15 * 60; // 15분

    constructor(
        @inject(TokenUtil) private tokenUtil: TokenUtil
    ) {
        this.memoryCache = new NodeCache({
            stdTTL: this.CACHE_DURATION, // 캐시 항목 기본 만료 시간
            checkperiod: this.CACHE_DURATION + 10, // 캐시 만료 검사 주기
        });
    }
    
    public requireAuth(req: ExtendedReq, res: Response, next: NextFunction): void {
        if(!req.username || !req.user_id){
            throw new UnauthorizedError();
        }
        next();
    }

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
            const payload = this.tokenUtil.verifyAccessToken(token);
        
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
            throw new UnauthorizedError();
        }
        next();
    }
}
/**
 * 쿠키로부터 토큰을 획득하여,
 * 토큰을 검증하고 원본을 변환한다.
 * 이때 토큰이 만료된 경우 쿠키에 저장된 리프레시 토큰을 검증한다.
 * 
 * 
 */