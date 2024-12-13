import errorHandler from '../middlewares/errorHandler';

// DB 및 보안 모듈
import Database from '../config/mysql';
import AuthMiddleware from '../middlewares/authMiddleware';

export {
    AuthMiddleware, Database,
    errorHandler,
}

/*
    require일 때, require는 동기식이다.
    따라서 withConnection이 마지막일 때 
    로딩되기 전에 다른 파일에서 import하면 undefined가 호출될 수 있다.

    결론: require를 할 때 순서가 영향을 미칠 수 있다.
    
    웬만하면 import 구문을 쓰는 게 더 좋을 수 있다.
 */