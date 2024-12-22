import express, { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'; // 쿠키 분석 미들웨어
import methodOverride from 'method-override'; // HTTP 메서드 오버라이드

// 기본 모듈 설정 및 적용
export default (app: Express) => {
    app.use(cookieParser()); // 쿠키 해석
    app.use(express.urlencoded({ extended: true })); // HTML 폼 데이터 해석 및 req.body에 주입
    app.use(express.json()); // JSON 파싱
    app.use(methodOverride('_method')); 

    app.set('view engine', 'ejs');// 뷰 엔진 ejs 설정
    app.set('views', path.join(__dirname, '../../views')); // 뷰 파일 경로 설정
    
    app.use(express.static(path.join(__dirname, '../../public'))); // 정적 파일 경로 설정
    app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
};