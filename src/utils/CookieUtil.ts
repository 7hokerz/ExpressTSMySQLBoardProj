import { Request, Response, CookieOptions } from "express";

export class CookieUtil {
    /**
     * 쿠키를 안전하게 설정하고 기존 쿠키를 제거하는 유틸리티 메서드
     * @param key - 쿠키 키
     * @param token - 쿠키 값 (선택적)
     * @param options - 추가 쿠키 옵션 (선택적)
     */
    static manageCookie(
        req: Request, 
        res: Response, 
        key: string,
        token?: string, 
        options?: CookieOptions
    ): void {
        if(req.cookies[key]) res.clearCookie(key);
        
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