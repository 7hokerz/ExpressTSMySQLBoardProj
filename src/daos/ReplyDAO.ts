import { PoolConnection } from 'mysql2/promise';
import { RawComment } from "../types/post.types";
import QueryExecutor from './QueryExecutor';
import { ICommentRepository } from '../domain/interfaces';

export default class CommentDAO implements ICommentRepository {
    constructor(connection: PoolConnection) {
        QueryExecutor.initialize(connection);
    }

    async getComment(commentId: number): Promise<any | null> {
        const query = `
        SELECT user_id FROM comments
        WHERE comment_id = ?`;

        const { rows } = await QueryExecutor.executeQuery<Pick<RawComment, "user_id">>(query, [commentId]);

        return rows[0] || null;
    }

    async createComment(postId: number, userId: number, content: string): Promise<void> {
        const query = `
        INSERT INTO comments (post_id, user_id, content) 
        VALUES (?, ?, ?)`;

        await QueryExecutor.executeQuery<never>(query, [postId, userId, content]);
    }

    async deleteComment(commentId: number): Promise<void> {
        const query = `
        DELETE FROM comments 
        WHERE comment_id = ?`;

        await QueryExecutor.executeQuery<never>(query, [commentId]);
    }
    
    async deleteCommentAll(postId: number): Promise<void> {
        const query = `
        DELETE FROM comments 
        WHERE post_id = ?`;

        await QueryExecutor.executeQuery<never>(query, [postId]);
    }
}