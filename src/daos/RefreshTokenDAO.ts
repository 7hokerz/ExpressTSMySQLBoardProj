import { PoolConnection } from 'mysql2/promise';
import { TokenByRefresh } from '../utils/types-modules';
import QueryExecutor from './QueryExecutor';
import { ITokenRepository } from '../domain/interfaces/';

export default class RefreshTokenDAO implements ITokenRepository {
    constructor(connection: PoolConnection) {
        QueryExecutor.initialize(connection);
    }
    // 리프레시 토큰 DB에 저장
    async create(userId: number, token: string, expiresAt: Date): Promise<void> {
        const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES (?, ?, ?)`;
        await QueryExecutor.executeQuery<never>(query, [userId, token, expiresAt]);
    }
    // 리프레시 토큰 획득
    async getRefreshToken(token: string): Promise<TokenByRefresh> {
        const query = `SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`;
        const { rows } = await QueryExecutor.executeQuery<TokenByRefresh>(query, [token]);
        return rows as any;
    }
    // 특정 사용자의 토큰 모두 삭제
    async deleteAllByUser(userId: number): Promise<void> {
        const query = `DELETE FROM refresh_tokens WHERE user_id = ?`;
        await QueryExecutor.executeQuery<never>(query, [userId]);
    }
    // 특정 토큰 삭제
    async deleteByToken(token: string): Promise<void> {
        const query = `DELETE FROM refresh_tokens WHERE token = ?`;
        await QueryExecutor.executeQuery<never>(query, [token]);
    }
}