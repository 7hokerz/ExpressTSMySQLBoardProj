import { TokenByRefresh } from '../../interfaces';

export interface ITokenRepository {
    create(userId: number, token: string, expiresAt: Date): Promise<void>;
    getRefreshToken(token: string): Promise<TokenByRefresh>;
    deleteAllByUser(userId: number): Promise<void>;
    deleteByToken(token: string): Promise<void>;
}