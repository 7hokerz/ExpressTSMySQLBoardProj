"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const upload_1 = require("../config/upload");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
const imageController = tsyringe_1.container.resolve(controllers_1.ImageController);
router.post('/', upload_1.upload.single('image'), imageController.uploadImage);
exports.default = router;
/**
 * - 파일 및 파일 제목 검증
 * - 파일명 생성 및 최종 경로 설정
 * - 클라이언트에 최종 경로 전송
 */ 
