"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); // 쿠키 분석 미들웨어
const method_override_1 = __importDefault(require("method-override")); // HTTP 메서드 오버라이드
// 기본 모듈 설정 및 적용
exports.default = (app) => {
    app.use((0, cookie_parser_1.default)()); // 쿠키 해석
    app.use(express_1.default.urlencoded({ extended: true })); // HTML 폼 데이터 해석 및 req.body에 주입
    app.use(express_1.default.json()); // JSON 파싱
    app.use((0, method_override_1.default)('_method'));
    app.set('view engine', 'ejs'); // 뷰 엔진 ejs 설정
    app.set('views', path_1.default.join(__dirname, '../../views')); // 뷰 파일 경로 설정
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../public'))); // 정적 파일 경로 설정
};
