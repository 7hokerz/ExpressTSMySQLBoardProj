
export interface ICommentRepository {
    getComment(commentId: number): Promise<number | null>;
    createComment(postId: number, userId: number, content: string): Promise<void>;
    deleteComment(commentId: number): Promise<void>;
    deleteCommentAll(postId: number): Promise<void>;
}