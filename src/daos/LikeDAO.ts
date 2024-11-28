import { Connection, PoolConnection } from "mysql2/promise";
import { injectable, inject } from 'tsyringe';
import { QueryService } from '../services/QueryService';

@injectable()
export default class LikeDAO {
    constructor(
        connection: Connection | PoolConnection,
        @inject(QueryService) private queryService: QueryService = new QueryService(connection)
    ) {}

    async getLikeYN(userId: number, postId: number): Promise<string> {
        const query = `
        SELECT 1 FROM postLike
        WHERE user_id = ? AND post_id = ?`;
        const { rows } = await this.queryService.executeQuery<any>(query, [userId, postId]);

        return rows.length > 0 ? "deleteLike" : "like";
    }

    async updateLike(userId: number, postId: number): Promise<void> {
        const query = `
        INSERT INTO postLike
        (user_id, post_id) VALUES (?, ?)`;

        const { header } = await this.queryService.executeQuery<never>(query, [userId, postId]);

        if (header.affectedRows === 0) {
            throw new Error(`Post with ID ${postId} not found`);
        }
    }

    async deleteLike(userId: number, postId: number): Promise<void> {
        const query = `
        DELETE FROM postLike
        WHERE user_id = ? AND post_id = ?`;
        
        const { header } = await this.queryService.executeQuery<never>(query, [userId, postId]);

        if (header.affectedRows === 0) {
            throw new Error(`Post with ID ${postId} not found`);
        }
    }

    async deleteLikeAll(postId: number): Promise<void> {
        const query = `
        DELETE FROM postLike 
        WHERE post_id = ?`;

        const { header } = await this.queryService.executeQuery<never>(query, [postId]);

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