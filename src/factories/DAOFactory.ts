import { PoolConnection } from 'mysql2/promise';
import { 
    UserDAO, 
    ReplyDAO, 
    LikeDAO, 
    PostDAO, 
    RefreshTokenDAO 
} from '../utils/shared-modules';

export default class DAOFactory {
    private static instance: DAOFactory;
    
    private constructor() {}

    public static getInstance(): DAOFactory {
        if (!DAOFactory.instance) {
          DAOFactory.instance = new DAOFactory();
        }
        return DAOFactory.instance;
    }

    createPostDAO(connection: PoolConnection): PostDAO {
        return new PostDAO(connection);
    }

    createUserDAO(connection: PoolConnection): UserDAO {
        return new UserDAO(connection);
    }

    createCommentDAO(connection: PoolConnection): ReplyDAO {
        return new ReplyDAO(connection);
    }

    createLikeDAO(connection: PoolConnection): LikeDAO {
        return new LikeDAO(connection);
    }

    createRefreshTokenDAO(connection: PoolConnection) {
        return new RefreshTokenDAO(connection);
    }
}