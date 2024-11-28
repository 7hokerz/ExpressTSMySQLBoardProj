import { Connection, PoolConnection } from "mysql2/promise";
import { UserDTO } from '../utils/shared-modules';
import { injectable, inject } from 'tsyringe';
import { RawComment } from "../types/post.types";
import { QueryService } from '../services/QueryService';

@injectable()
export default class CommentDAO{
    constructor(
        connection: Connection | PoolConnection,
        @inject(QueryService) private queryService: QueryService = new QueryService(connection)
    ) {}

    async getComment(commentId: number): Promise<UserDTO | null> {
        const query = `
        SELECT user_id FROM comments
        WHERE comment_id = ?`;

        const { rows } = await this.queryService.executeQuery<Pick<RawComment, "user_id">>(query, [commentId]);
        const pubId = rows[0];
        
        if(pubId === null || pubId === undefined) return null;

        return new UserDTO(pubId.user_id);
    }

    async createComment(postId: number, userId: number, content: string): Promise<void> {
        const query = `
        INSERT INTO comments (post_id, user_id, content) 
        VALUES (?, ?, ?)`;

        await this.queryService.executeQuery<never>(query, [postId, userId, content]);
    }

    async deleteComment(commentId: number): Promise<void> {
        const query = `
        DELETE FROM comments 
        WHERE comment_id = ?`;

        await this.queryService.executeQuery<never>(query, [commentId]);
    }
    
    async deleteCommentAll(postId: number): Promise<void> {
        const query = `
        DELETE FROM comments 
        WHERE post_id = ?`;

        await this.queryService.executeQuery<never>(query, [postId]);
    }
}