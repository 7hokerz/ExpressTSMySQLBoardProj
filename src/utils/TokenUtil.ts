import jwt, { Secret, TokenExpiredError } from 'jsonwebtoken';
import { singleton } from 'tsyringe';
import { TokenPayload } from '../types/TokenPayload.types';
import env from "../config/index";


@singleton()
export default class JwtToken {
    #jwtSecret: Secret;
    #refreshSecret: Secret;

    constructor() {
        const secret = env.secret.secret;
        const refreshSecret = env.secret.refreshsecret;
        if (!secret || !refreshSecret) {
            throw new Error('JWT secret key is required');
        }
        this.#jwtSecret = secret;
        this.#refreshSecret = refreshSecret;
    }
    // username, user_id를 포함하는 jwt 생성
    public generateAccessToken(username: string, id: number): string {
        const payload: TokenPayload = { username, id };
        return jwt.sign(payload, this.#jwtSecret, {expiresIn: '1h' });
    }

    public generateRefreshToken(username: string, id: number): string {
        const payload: TokenPayload = { username, id };
        return jwt.sign(payload, this.#refreshSecret, {expiresIn: '7d' });
    }
    // 토큰에서 원래의 Payload 추출 및 검증 
    public verifyAccessToken(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, this.#jwtSecret) as TokenPayload; 
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                console.error('Token expired:', error.message);
            } else if (error instanceof Error) {
                console.error('Token verification failed:', error.message);
                throw new Error('Invalid or expired token');
            }
            return null;
        }
    }

    public verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.#refreshSecret) as TokenPayload; 
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
}



/*
    TokenPayload 인터페이스
    - 토큰에 들어가는 데이터를 정의    
        username(아이디), user_id(식별 번호)

    JwtToken 클래스
    - 생성자: .env에서 시크릿 키를 불러온 후 할당
    - generateToken
        데이터를 암호화하여 토큰을 반환
    - verifyToken
        토큰을 해독하여 무결성을 확인하고 원본을 반환
    

    추후 수정 및 추가할 내용?
    - 
*/