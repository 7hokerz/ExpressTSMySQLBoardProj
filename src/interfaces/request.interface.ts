import { Request } from 'express';

// 추가 요소를 담은 요청 인터페이스
export interface ExtendedReq extends Request {
    username?: string;
    user_id?: number;
}