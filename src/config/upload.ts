import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { ImageType } from '../types';

// 이미지 파일 유형 검증
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const fileExtension = path.extname(file.originalname).toLocaleLowerCase().slice(1);

    if(Object.values(ImageType).includes(fileExtension as ImageType)){
        cb(null, true);
    }
    else cb(new Error('Invalid file type. Only image files are allowed.'));
};

// 저장 위치, 파일명 설정
const storage = multer.diskStorage({
    destination: (
        req: Request, 
        file: Express.Multer.File, 
        cb: (error: Error | null, destination: string) => void
    ) => {
        cb(null, './uploads/');
    },
    filename: (
        req: Request, 
        file: Express.Multer.File, 
        cb: (error: Error | null, filename: string) => void
    ) => {
        cb(null, Date.now() + file.originalname);
    },
});

// 업로드 설정
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
        files: 1,
    }
});

/**
 * filefilter
 * path.extname(): 파일명에서 확장자 추출
 * toLowerCase().slice(1): 소문자로 변환 후 . 제거
 * 
 * Object.values(ImageType).includes()
 * : 열거형에 있는 값들 중 현재 확장자가 있는지 확인
 * 
 */