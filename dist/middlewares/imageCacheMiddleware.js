"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCacheMiddleware = void 0;
const path_1 = __importDefault(require("path"));
const types_modules_1 = require("../utils/types-modules");
const imageCacheMiddleware = (req, res, next) => {
    const fileExtension = path_1.default.extname(req.url).toLowerCase().slice(1);
    if (Object.values(types_modules_1.ImageType).includes(fileExtension)) {
        // 1달 간 캐시 유지
        res.setHeader('Cache-Control', 'public, max-age=2628000, immutable');
        // ETag 지원 (리소스 변경 확인용)
        res.setHeader('ETag', Date.now().toString());
    }
    next();
};
exports.imageCacheMiddleware = imageCacheMiddleware;
