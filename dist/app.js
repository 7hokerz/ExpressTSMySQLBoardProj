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
const dotenv_1 = __importDefault(require("dotenv")); // 타입 및 모듈, 미들웨어 등 임포트
dotenv_1.default.config();
require("reflect-metadata");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_2 = __importDefault(require("./config/express"));
const shared_modules_1 = require("./utils/shared-modules");
const routes_1 = __importDefault(require("./routes"));
//일정 횟수가 초과하면 오류 메시지 전송
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: "요청 횟수 초과.",
});
const auth = new shared_modules_1.AuthMiddleware();
const app = (0, express_1.default)();
(0, express_2.default)(app);
app.use(auth.cookieAuth); // 토큰을 해석하여 body에 삽입
//app.use(limiter);
app.use('/', routes_1.default.login);
app.use('/uploads', auth.requireAuth, express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/posts', auth.requireAuth, routes_1.default.posts);
app.use('/user', auth.requireAuth, routes_1.default.userInfo);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.username) {
        return res.redirect('/posts');
    }
    res.redirect('login');
}));
app.get('*', (req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});
app.use(shared_modules_1.errorHandler);
exports.default = app;
/*
    app.js의 주요 기능 설명
    - 메인 서버 미들웨어로서 주요 서버에 대한 설정을 적용 및 라우터 지정
        

    app.js 주요 편집 내용
    -

    추후 수정 및 추가할 내용?
    - 로그 기능 추가 필요

    + return 문이 존재하지 않으면 밑의 코드가 실행되어 오류가 발생한다.
    이유는 redirect로 응답을 보냈으나, send로 또 응답을 보내려 하기 때문...
*/ 
