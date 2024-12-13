import { TokenUtil } from "../utils/";
import { withDB } from "../decorators";
import { DAOFactory, RefreshTokenDAO } from '../daos';
import { injectable, inject } from "tsyringe";

@injectable()
@withDB
export default class TokenService {
    private daofactory!: DAOFactory;

    constructor(
        @inject(TokenUtil) private jwttoken: TokenUtil = new TokenUtil()
    ) {}

    // 리프레시, 액세스 토큰 생성
    async generateToken(userId: number, username: string, stat: boolean): Promise<any> {
        const refreshTokenDAO = this.daofactory.getDAO(RefreshTokenDAO);

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
    async verifyToken(token: string) {
        const refreshTokenDAO = this.daofactory.getDAO(RefreshTokenDAO);
        
        const storedToken = await refreshTokenDAO.getRefreshToken(token);
        
        if(!storedToken || new Date(storedToken.expiresAt) < new Date()) {
            throw new Error('만료되거나 유효하지 않은 토큰');
        }
        
        const payload = this.jwttoken.verifyRefreshToken(token);

        return { userId: payload.id, username: payload.username };
    }
}