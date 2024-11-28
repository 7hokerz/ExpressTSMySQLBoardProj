"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDAO = exports.LikeDAO = exports.ReplyDAO = exports.PostDAO = exports.UserDAO = exports.UserDTO = exports.CommentDTO = exports.PostDetailsDTO = exports.PostDTO = exports.TransactionError = exports.HttpError = exports.DAOFactory = exports.jwtToken = exports.db = exports.routes = exports.AuthMiddleware = exports.errorHandler = exports.autoBind = exports.withConnection = void 0;
// 데코레이터
const withConnection_1 = require("../decorators/withConnection");
Object.defineProperty(exports, "withConnection", { enumerable: true, get: function () { return withConnection_1.withConnection; } });
const autoBind_1 = __importDefault(require("../decorators/autoBind"));
exports.autoBind = autoBind_1.default;
// DTO
const DTOs_1 = require("../dtos/DTOs");
Object.defineProperty(exports, "PostDTO", { enumerable: true, get: function () { return DTOs_1.PostDTO; } });
Object.defineProperty(exports, "PostDetailsDTO", { enumerable: true, get: function () { return DTOs_1.PostDetailsDTO; } });
Object.defineProperty(exports, "CommentDTO", { enumerable: true, get: function () { return DTOs_1.CommentDTO; } });
Object.defineProperty(exports, "UserDTO", { enumerable: true, get: function () { return DTOs_1.UserDTO; } });
// 오류 모듈
const HttpError_1 = __importDefault(require("../errors/HttpError"));
exports.HttpError = HttpError_1.default;
const TransactionError_1 = __importDefault(require("../errors/TransactionError"));
exports.TransactionError = TransactionError_1.default;
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
exports.errorHandler = errorHandler_1.default;
// DB 및 보안 모듈
const DAOFactory_1 = __importDefault(require("../factories/DAOFactory"));
exports.DAOFactory = DAOFactory_1.default;
const mysql_1 = __importDefault(require("../config/mysql"));
exports.db = mysql_1.default;
const token_1 = __importDefault(require("../middlewares/token"));
exports.jwtToken = token_1.default;
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
exports.AuthMiddleware = authMiddleware_1.default;
// DAO 모듈
const UserDAO_1 = __importDefault(require("../daos/UserDAO"));
exports.UserDAO = UserDAO_1.default;
const PostDAO_1 = __importDefault(require("../daos/PostDAO"));
exports.PostDAO = PostDAO_1.default;
const LikeDAO_1 = __importDefault(require("../daos/LikeDAO"));
exports.LikeDAO = LikeDAO_1.default;
const ReplyDAO_1 = __importDefault(require("../daos/ReplyDAO"));
exports.ReplyDAO = ReplyDAO_1.default;
const RefreshTokenDAO_1 = __importDefault(require("../daos/RefreshTokenDAO"));
exports.RefreshTokenDAO = RefreshTokenDAO_1.default;
// 라우터 모듈
const postRoutes_1 = __importDefault(require("../routes/postRoutes"));
const loginRoutes_1 = __importDefault(require("../routes/loginRoutes"));
const userInfo_1 = __importDefault(require("../routes/userInfo"));
const routes = {
    posts: postRoutes_1.default,
    login: loginRoutes_1.default,
    userInfo: userInfo_1.default,
};
exports.routes = routes;
/*
    require일 때, require는 동기식이다.
    따라서 withConnection이 마지막일 때
    로딩되기 전에 다른 파일에서 import하면 undefined가 호출될 수 있다.

    결론: require를 할 때 순서가 영향을 미칠 수 있다.
    
    웬만하면 import 구문을 쓰는 게 더 좋을 수 있다.
 */ 
