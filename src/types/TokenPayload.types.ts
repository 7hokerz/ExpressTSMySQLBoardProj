import { JwtPayload } from 'jsonwebtoken';

// 토큰 Payload 타입 정의
export interface TokenPayload extends JwtPayload {
    username: string;
    id: number;
}