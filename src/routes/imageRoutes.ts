import express from 'express';
import { container } from 'tsyringe';
import { upload } from '../config/upload';
import { ImageController } from '../controllers';

const router = express.Router();

const imageController = container.resolve(ImageController);

router.post(
    '/', 
    upload.single('image'), 
    imageController.uploadImage
);

export default router;

/**
 * - 파일 및 파일 제목 검증
 * - 파일명 생성 및 최종 경로 설정
 * - 클라이언트에 최종 경로 전송
 */