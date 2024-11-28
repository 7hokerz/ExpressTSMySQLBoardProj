// 데코레이터
import { withConnection } from '../decorators/withConnection';
import autoBind from '../decorators/autoBind';

// DTO
import { 
    PostDTO,
    PostDetailsDTO,
    CommentDTO,
    UserDTO 
} from '../dtos/DTOs';

// 오류 모듈
import HttpError from '../errors/HttpError';
import TransactionError from '../errors/TransactionError';
import errorHandler from '../middlewares/errorHandler';

// DB 및 보안 모듈
import DAOFactory from '../factories/DAOFactory';
import db from '../config/mysql';
import jwtToken from '../middlewares/token';
import AuthMiddleware from '../middlewares/authMiddleware';

// DAO 모듈
import UserDAO from '../daos/UserDAO';
import PostDAO from '../daos/PostDAO';
import LikeDAO from '../daos/LikeDAO';
import ReplyDAO from '../daos/ReplyDAO';
import RefreshTokenDAO from '../daos/RefreshTokenDAO';

// 라우터 모듈
import postRoutes from '../routes/postRoutes';
import loginRoutes from '../routes/loginRoutes';
import userInfoRoutes from '../routes/userInfo';

const routes = {
    posts: postRoutes,
    login: loginRoutes,
    userInfo: userInfoRoutes,
};

export {
    withConnection, autoBind, errorHandler, 
    AuthMiddleware, routes, db, 
    jwtToken,
    DAOFactory, 
    HttpError, TransactionError,
    PostDTO, PostDetailsDTO,
    CommentDTO, UserDTO,
    UserDAO, PostDAO, ReplyDAO, LikeDAO, RefreshTokenDAO,
}

/*
    require일 때, require는 동기식이다.
    따라서 withConnection이 마지막일 때 
    로딩되기 전에 다른 파일에서 import하면 undefined가 호출될 수 있다.

    결론: require를 할 때 순서가 영향을 미칠 수 있다.
    
    웬만하면 import 구문을 쓰는 게 더 좋을 수 있다.
 */