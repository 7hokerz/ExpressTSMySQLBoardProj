import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { ImageType } from '../types';

export const imageCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const fileExtension = path.extname(req.url).toLowerCase().slice(1);

    if (Object.values(ImageType).includes(fileExtension as ImageType)) {

        try {
            // 1달 간 캐시 유지
            res.setHeader('Cache-Control', 'public, max-age=2628000, immutable');
            // ETag 지원 (리소스 변경 확인용)

            //res.setHeader('ETag', Date.now().toString());
            // 정해진 MIME 타입만으로 렌더링
            res.setHeader('X-Content-Type-Options', 'nosniff');

        } catch (error) {
            console.error('Error accessing file:', error);
        }
    }
    next();
}

/**
 * 이미지 캐싱 미들웨어
 * 
 * ETag: 특정 자원에 대한 응답을 식별하는 키
 * 
 * 1. 첫 요청 시 etag 값은 응답 객체 헤더에 포함되어 전송된다.
 * 2. 동일한 요청 시, 클라이언트는 etag 값을 포함한 요청을 전송
 * 3. 서버는 자신이 가진 값과 이 값을 비교
 * - 일치하는 경우, 304 응답을 보내고, 클라이언트는 캐시된 내용 재사용
 * - 일치하지 않는 경우, 데이터를 200 응답과 함께 전송
 * 
 */