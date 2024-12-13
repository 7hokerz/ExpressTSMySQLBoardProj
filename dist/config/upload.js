"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const types_modules_1 = require("../utils/types-modules");
// 이미지 파일 유형 검증
const fileFilter = (req, file, cb) => {
    const fileExtension = path_1.default.extname(file.originalname).toLocaleLowerCase().slice(1);
    if (Object.values(types_modules_1.ImageType).includes(fileExtension)) {
        cb(null, true);
    }
    else
        cb(new Error('Invalid file type. Only image files are allowed.'));
};
// 저장 위치, 파일명 설정
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});
// 업로드 설정
exports.upload = (0, multer_1.default)({
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
