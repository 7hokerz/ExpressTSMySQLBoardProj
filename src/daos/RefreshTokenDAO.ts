import { Connection, PoolConnection } from 'mysql2/promise';
import { TokenByRefresh } from '../utils/types-modules';
import { injectable, inject } from 'tsyringe';
import { QueryService } from '../services/QueryService';

@injectable()
export default class RefreshTokenDAO {
    constructor(
        connection: Connection | PoolConnection,
        @inject(QueryService) private queryService: QueryService = new QueryService(connection)
    ) {}

    // 리프레시 토큰 DB에 저장
    async create(userId: number, token: string, expiresAt: Date): Promise<void> {
        const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES (?, ?, ?)`;
        await this.queryService.executeQuery<never>(query, [userId, token, expiresAt]);
    }
    // 리프레시 토큰 획득
    async getRefreshToken(token: string): Promise<TokenByRefresh> {
        const query = `SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`;
        const { rows } = await this.queryService.executeQuery<TokenByRefresh>(query, [token]);
        return rows as any;
    }
    // 특정 사용자의 토큰 모두 삭제
    async deleteAllByUser(userId: number): Promise<void> {
        const query = `DELETE FROM refresh_tokens WHERE user_id = ?`;
        await this.queryService.executeQuery<never>(query, [userId]);
    }
    // 특정 토큰 삭제
    async deleteByToken(token: string): Promise<void> {
        const query = `DELETE FROM refresh_tokens WHERE token = ?`;
        await this.queryService.executeQuery<never>(query, [token]);
    }
}