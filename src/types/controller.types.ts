import { Request, Response, NextFunction } from 'express';

export interface HttpResponse<T = any> {
    success: boolean;      // 요청 성공 여부
    data?: T;             // 응답 데이터 (optional)
    error?: string;       // 에러 메시지 (optional)
    status: number;       // HTTP 상태 코드
}

// 
export interface ControllerV1 {
    execute: (req: Request, res: Response, next: NextFunction) => Promise<HttpResponse>;
}