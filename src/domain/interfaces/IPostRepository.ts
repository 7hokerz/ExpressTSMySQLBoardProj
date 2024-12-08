import { PostDTO, PostDetailsDTO, CommentDTO, UserDTO } from '../entities';

export interface IPostRepository {
    getPosts(): Promise<any>;
    getPostDetails(postId: number): Promise<any | null>;
    getPostDetailsYN(postId: number): Promise<number | null>;
    deletePost(postId: number): Promise<void>;
    updatePost(post: Pick<PostDTO, 'post_id' | 'title'| 'content'>): Promise<void>;
    createPost(
        post: Pick<PostDTO, 'title'| 'content' | 'imageurl'>, userId: number
    ): Promise<void>;
}