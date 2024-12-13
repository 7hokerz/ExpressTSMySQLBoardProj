"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.Database = exports.AuthMiddleware = void 0;
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
exports.errorHandler = errorHandler_1.default;
// DB 및 보안 모듈
const mysql_1 = __importDefault(require("../config/mysql"));
exports.Database = mysql_1.default;
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
exports.AuthMiddleware = authMiddleware_1.default;
/*
    require일 때, require는 동기식이다.
    따라서 withConnection이 마지막일 때
    로딩되기 전에 다른 파일에서 import하면 undefined가 호출될 수 있다.

    결론: require를 할 때 순서가 영향을 미칠 수 있다.
    
    웬만하면 import 구문을 쓰는 게 더 좋을 수 있다.
 */ 
