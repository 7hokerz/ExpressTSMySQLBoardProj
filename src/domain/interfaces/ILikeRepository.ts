enum LikeStatus {
    LIKED = 'LIKED',
    NOT_LIKED = 'NOT_LIKED'
}

export interface ILikeRepository {
    getPostLikeInfo(userId: number, postId: number): Promise<LikeStatus>;
    updateLike(userId: number, postId: number): Promise<void>;
    deleteLike(userId: number, postId: number): Promise<void>;
    deleteLikeAll(postId: number): Promise<void>;
}