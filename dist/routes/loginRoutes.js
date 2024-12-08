"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const controllers_2 = require("../controllers");
const router = express_1.default.Router();
const userController = new controllers_1.UserController();
const tokenController = new controllers_2.TokenController();
router.route('/signup') //회원가입
    .get((req, res) => { res.render('signup'); })
    .post(userController.signup);
router.get('/withdraw', userController.withdraw); //회원탈퇴
router.route('/login') //로그인
    .get((req, res) => {
    if (req.username)
        return res.redirect('/posts');
    res.render('login');
})
    .post(userController.login); // 로
router.get('/logout', userController.logout);
router.get('/refresh-token', tokenController.refreshToken);
exports.default = router;
/*
    loginsignup.js의 주요 기능 설명
    - 회원가입 라우터:
        GET: 회원가입 페이지 렌더링
        POST: 회원가입 정보 전달
    - 회원탈퇴 라우터: 회원탈퇴
    - 로그인 라우터:
        GET: 로그인 페이지 렌더링
        POST: 로그인 정보 전달

    loginsignup.js 주요 편집 내용

    추후 수정 및 추가할 내용
    
*/ 
