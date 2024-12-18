import { PoolConnection } from 'mysql2/promise';
import { ILikeRepository } from '../domain/interfaces/';
import { NotFoundError } from '../errors';
import QueryExecutor from './QueryExecutor';
import { LikeStatus } from '../types';

export default class LikeDAO implements ILikeRepository {
    constructor(connection: PoolConnection) {
        QueryExecutor.initialize(connection);
    }

    async getPostLikeInfo(userId: number, postId: number): Promise<LikeStatus> {
        const query = `
        SELECT EXISTS (
            SELECT 1 FROM postLike
            WHERE user_id = ? AND post_id = ?
        ) as isLiked`;
        const { rows } = await QueryExecutor.executeQuery(query, [userId, postId]);
        return rows[0].isLiked ? LikeStatus.LIKED : LikeStatus.NOT_LIKED;
    }

    async updateLike(userId: number, postId: number): Promise<void> {
        const query = `
        INSERT INTO postLike
        (user_id, post_id) VALUES (?, ?)`;

        const { header } = await QueryExecutor.executeQuery(query, [userId, postId]);

        if (header.affectedRows === 0) {
            throw new Error(`Post with ID ${postId} not found`);
        }
    }

    async deleteLike(userId: number, postId: number): Promise<void> {
        const query = `
        DELETE FROM postLike
        WHERE user_id = ? AND post_id = ?`;
        
        const { header } = await QueryExecutor.executeQuery(query, [userId, postId]);

        if (header.affectedRows === 0) {
            throw new NotFoundError(`Post with ID ${postId}`);
        }
    }

    async deleteLikeAll(postId: number): Promise<void> {
        const query = `
        DELETE FROM postLike 
        WHERE post_id = ?`;

        const { header } = await QueryExecutor.executeQuery(query, [postId]);

        //if (header.affectedRows === 0) {
            //throw new Error(`Post with ID ${postId} not found`);
        //}
    }
}

/*
    LikeDAO.js의 주요 기능 설명
    - 

    LikeDAO.js 주요 편집 내용
    - getLikeYN에서 쿼리문을 SELECT 1 로 수정하여 효율성 개선

    추후 수정 및 추가할 내용?
    -
*/