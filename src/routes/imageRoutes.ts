import express, { Request, Response, NextFunction } from 'express';
import { upload } from '../config/upload';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

router.post(
    '/', 
    upload.single('image'), 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;

            if (!file || !(req.body.fileName)) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            const fileName = `${req.body.fileName}${path.extname(file.originalname)}`;
            const rndName = Date.now();

            await fs.rename(
                file.path, 
                `${path.dirname(file.path)}/${rndName + '_' + fileName}`
            );
            
            res.json({
                title: req.body.fileName || 'Untitled',
                imageUrl: `/uploads/${rndName  + '_' + fileName}`,
            });
        } catch(error) {
            next(error);
        }
});

export default router;

/**
 * - 파일 및 파일 제목 검증
 * - 파일명 생성 및 최종 경로 설정
 * - 클라이언트에 최종 경로 전송
 */