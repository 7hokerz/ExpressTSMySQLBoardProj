

export interface IPostRepository {
    getPosts(): Promise<any>;
    getPostDetails(postId: number): Promise<any | null>;
    getPostDetailsYN(postId: number): Promise<number | null>;
    deletePost(postId: number): Promise<void>;
    updatePost(post: any): Promise<void>;
    createPost(
        post: any, userId: number
    ): Promise<void>;
}