import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { ImageType } from '../utils/types-modules';

export const imageCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const fileExtension = path.extname(req.url).toLowerCase().slice(1);

    if (Object.values(ImageType).includes(fileExtension as ImageType)) {
        // 1달 간 캐시 유지
        res.setHeader('Cache-Control', 'public, max-age=2628000, immutable');
        
        // ETag 지원 (리소스 변경 확인용)
        res.setHeader('ETag', Date.now().toString());
    }
    next();
}