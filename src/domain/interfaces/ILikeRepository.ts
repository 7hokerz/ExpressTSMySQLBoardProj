import { PostDTO, PostDetailsDTO, CommentDTO, UserDTO } from '../entities';

export interface ILikeRepository {
    getLikeYN(userId: number, postId: number): Promise<string>;
    updateLike(userId: number, postId: number): Promise<void>;
    deleteLike(userId: number, postId: number): Promise<void>;
    deleteLikeAll(postId: number): Promise<void>;
}