"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = __importDefault(require("../controllers/userController"));
// 회원정보 페이지 렌더링
router.get('/', userController_1.default.renderUserInfoPage);
// 회원정보 수정 페이지 렌더링 및 수정 라우터
router.route('/edit')
    .get(userController_1.default.renderEditPage)
    .put(userController_1.default.edit);
exports.default = router;
/*
    userInfo.js의 주요 기능 설명
    - '/' 라우터: 회원정보 페이지 렌더링
    - '/edit' 라우터:
    GET: 회원정보수정 페이지 렌더링
    PUT:
        1. XSS 방지를 위한 유효성 검증
        2. 중복된 아이디(username) 검증
        3. 회원 유무 검증
        4. 기존 패스워드가 일치하는지 검증
        이후 정보 변경 및 쿠키 생성

    userInfo.js 주요 편집 내용
    -

    추후 수정 및 추가할 내용?
    -
 
*/ 
