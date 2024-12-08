"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../config/upload");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const router = express_1.default.Router();
router.post('/', upload_1.upload.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file || !(req.body.fileName)) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const fileName = `${req.body.fileName}${path_1.default.extname(file.originalname)}`;
        const rndName = Date.now();
        yield promises_1.default.rename(file.path, `${path_1.default.dirname(file.path)}/${rndName + '_' + fileName}`);
        res.json({
            title: req.body.fileName || 'Untitled',
            imageUrl: `/uploads/${rndName + '_' + fileName}`,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
/**
 * - 파일 및 파일 제목 검증
 * - 파일명 생성 및 최종 경로 설정
 * - 클라이언트에 최종 경로 전송
 */ 
