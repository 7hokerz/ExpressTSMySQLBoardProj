import { 
    DAOFactory, 
    HttpError, 
    jwtToken,
    withConnection,
} from "../utils/shared-modules";

class tokenService {
    #daofactory: DAOFactory;
    private readonly jwttoken: jwtToken;

    constructor() {
        this.jwttoken = new jwtToken();
        this.#daofactory = DAOFactory.getInstance();
    }
    // 리프레시, 액세스 토큰 생성
    @withConnection(false, HttpError)
    async generateToken(userId: number, username: string, stat: boolean): Promise<any> {
        const connection = arguments[arguments.length - 1];
        const refreshTokenDAO = this.#daofactory.createRefreshTokenDAO(connection);

        const token = { // 토큰 발급
            accessToken: this.jwttoken.generateAccessToken(username, userId),
            ...(stat ? { 
                refreshToken: this.jwttoken.generateRefreshToken(username, userId) 
            } : {})
        }

        // 만료 시간 설정 (7일)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        if (stat && token.refreshToken) {
            await refreshTokenDAO.create(userId, token.refreshToken, expiresAt);
        }
        return token;
    }
    // 리프레시 토큰 검증
    @withConnection(false, HttpError)
    async verifyToken(token: string) {
        const connection = arguments[arguments.length - 1];
        const refreshTokenDAO = this.#daofactory.createRefreshTokenDAO(connection);
        
        const storedToken = await refreshTokenDAO.getRefreshToken(token);
        
        if(!storedToken || new Date(storedToken.expiresAt) < new Date()) {
            throw new Error('Refresh token is invalid or expired');
        }
        
        const payload = this.jwttoken.verifyRefreshToken(token);

        return { userId: payload.id, username: payload.username };
    }
}

export default new tokenService();