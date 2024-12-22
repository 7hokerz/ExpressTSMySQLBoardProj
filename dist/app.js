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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const express_2 = __importDefault(require("./config/express"));
const middlewares_1 = require("./middlewares");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const auth = tsyringe_1.container.resolve(middlewares_1.AuthMiddleware);
const app = (0, express_1.default)();
(0, express_2.default)(app);
app.use(auth.cookieAuth); // 토큰을 해석하여 body에 삽입
app.use('/', routes_1.default.login);
app.use('/posts', auth.requireAuth, routes_1.default.posts);
app.use('/user', auth.requireAuth, routes_1.default.userInfo);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.username)
        res.redirect('/posts');
    else
        res.redirect('/login');
}));
app.get('*', (req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});
// 에러 미들웨어
app.use(middlewares_1.validationErrorHandler);
app.use(middlewares_1.errorHandler);
exports.default = app;
