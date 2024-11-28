import { 
    DAOFactory, 
    HttpError, 
    TransactionError, 
    withConnection,
    PostDTO, 
} from '../utils/shared-modules';

class postService {
    #daofactory: DAOFactory;

    constructor(){
        this.#daofactory = DAOFactory.getInstance();
    }

    @withConnection<PostDTO[]>(false, HttpError)
    async posts(): Promise<PostDTO[]> {
        const connection = arguments[arguments.length - 1];
        const postDAO = this.#daofactory.createPostDAO(connection);
        return await postDAO.getPosts();
    }

    @withConnection<void>(false, HttpError)
    async newpost(post: PostDTO, user_id: number): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const postDAO = this.#daofactory.createPostDAO(connection);
        await postDAO.createPost(post, user_id);
    }

    @withConnection<any>(false, HttpError)
    async postdetail(postId: number, userId: number): Promise<any> {
        const connection = arguments[arguments.length - 1];
        const postDAO = this.#daofactory.createPostDAO(connection);
        const likeDAO = this.#daofactory.createLikeDAO(connection);

        const [postData, stat] = await Promise.all([
            postDAO.getPostDetails(postId),
            likeDAO.getLikeYN(userId, postId)
        ]);

        if(!postData){
            throw new HttpError(404, 'Post Not Found');
        }
        // 기존 post 객체에 stat 속성 추가
        postData.post = {
            ...postData.post, // 기존 속성 유지
            stat,             // stat 추가
        };
        
        return postData;
    }
    
    @withConnection<void>(true, HttpError, TransactionError)
    async deletepost(postId: number, userId: number): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const postDAO = this.#daofactory.createPostDAO(connection);
        const likeDAO = this.#daofactory.createLikeDAO(connection);
        const commentDAO = this.#daofactory.createCommentDAO(connection);

        const post = await postDAO.getPostDetailsYN(postId);
        
        if(post === null || post === undefined) {
            throw new HttpError(404, 'Post Not Found');
        }

        if(post.user_id !== userId){
            throw new HttpError(401, '게시글 작성자만 삭제할 수 있습니다.');
        }
        await likeDAO.deleteLikeAll(postId);
        await commentDAO.deleteCommentAll(postId);
        await postDAO.deletePost(postId);
    }

    @withConnection<void>(false, HttpError)
    async updatepost(post_id: number, userId: number, title: string, content: string): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const postDAO = this.#daofactory.createPostDAO(connection);

        const post = await postDAO.getPostDetailsYN(post_id);

        if((post !== null && post !== undefined) && post.user_id !== userId){
            throw new HttpError(401, '게시글 작성자만 수정할 수 있습니다.');
        }

        if(post !== null && post !== undefined){
            const update = { post_id, title, content };
            await postDAO.updatePost(update);
        }
    }

    @withConnection<any>(false, HttpError)
    async renderUpdate(postId: number, userId: number): Promise<any> {
        const connection = arguments[arguments.length - 1];
        const postDAO = this.#daofactory.createPostDAO(connection);

        const postData = await postDAO.getPostDetails(postId);

        if(!postData){
            throw new HttpError(404, 'Post Not Found');
        }
        
        if(postData.postUser.user_id !== userId){
            throw new HttpError(401, '게시글 작성자만 수정할 수 있습니다.');
        }
        return postData.post;
    }

    @withConnection<void>(false, HttpError)
    async like(postId: number, userId: number): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const likeDAO = this.#daofactory.createLikeDAO(connection);
        await likeDAO.updateLike(userId, postId);
    }

    @withConnection<void>(false, HttpError)
    async unlike(postId: number, userId: number): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const likeDAO = this.#daofactory.createLikeDAO(connection);
        await likeDAO.deleteLike(userId, postId);
    }

    @withConnection<void>(false, HttpError)
    async comment(postId: number, userId: number, content: string): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const commentDAO = this.#daofactory.createCommentDAO(connection);
        await commentDAO.createComment(postId, userId, content);
    }

    @withConnection<void>(false, HttpError)
    async deletecomment(commentId: number, userId: number): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const commentDAO = this.#daofactory.createCommentDAO(connection);

        const pubId = await commentDAO.getComment(commentId);
        if(!pubId) {
            throw new HttpError(404, 'Comment Not Found');
        }

        if(pubId.user_id !== userId){
            throw new HttpError(401, '댓글 작성자만 삭제할 수 있습니다.');
        }
        await commentDAO.deleteComment(commentId);
    }
}

export default new postService();

/*
    

*/