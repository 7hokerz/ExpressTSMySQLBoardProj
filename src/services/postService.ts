import { 
    HttpError, 
    withConnection,
} from '../utils/shared-modules';
import { CommentDTO, PostDetailsDTO, PostDTO, UserDTO } from '../domain/entities';
import { DAOFactory, PostDAO, LikeDAO, ReplyDAO } from '../daos';
import { RawComment } from '../utils/types-modules';

export default class PostService {
    private daofactory!: DAOFactory;

    @withConnection(false)
    async posts(): Promise<PostDTO[]> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        const posts = await postDAO.getPosts();

        return posts.map((post: PostDTO) => new PostDTO(
            post.post_id,
            post.title,
            post.content,
            post.created_at,
            post.like_count,
            post.view_count,
        ));
    }

    @withConnection(false)
    async newpost(post: PostDTO, user_id: number): Promise<void> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        await postDAO.createPost(post, user_id);
    }

    @withConnection(false)
    async postdetail(postId: number, userId: number): Promise<PostDetailsDTO> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        const likeDAO = this.daofactory.getDAO(LikeDAO);

        const [[posts, comments], stat] = await Promise.all([
            postDAO.getPostDetails(postId),
            likeDAO.getLikeYN(userId, postId)
        ]);

        if(!posts) {
            throw new HttpError(404, 'Post Not Found');
        }

        return new PostDetailsDTO(
            new PostDTO(
                posts.post_id,
                posts.title,
                posts.content,
                posts.created_at,
                posts.like_count,
                posts.view_count,
                posts.imageurl,
                stat,
            ),
            new UserDTO(
                posts.user_id,
                posts.username,
            ),
            (comments as RawComment[]).map(
                (comment) => new CommentDTO(
                    new UserDTO(
                        comment.user_id,
                        comment.username,
                    ),
                    comment.comment_id,
                    comment.content,
                    comment.created_at,
                )
            ),
        );
    }
    
    @withConnection(true)
    async deletepost(postId: number, userId: number): Promise<void> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        const likeDAO = this.daofactory.getDAO(LikeDAO);
        const commentDAO = this.daofactory.getDAO(ReplyDAO);

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

    @withConnection(false)
    async updatepost(post_id: number, userId: number, title: string, content: string): Promise<void> {
        const postDAO = this.daofactory.getDAO(PostDAO);

        const post = await postDAO.getPostDetailsYN(post_id);

        if((post !== null && post !== undefined) && post.user_id !== userId){
            throw new HttpError(401, '게시글 작성자만 수정할 수 있습니다.');
        }

        if(post !== null && post !== undefined){
            const update = { post_id, title, content };
            await postDAO.updatePost(update);
        }
    }

    @withConnection(false)
    async renderUpdate(postId: number, userId: number): Promise<PostDTO> {  
        const postDAO = this.daofactory.getDAO(PostDAO);

        const [posts] = await postDAO.getPostDetails(postId);

        if(!posts){
            throw new HttpError(404, 'Post Not Found');
        }
        
        if(posts.user_id !== userId){
            throw new HttpError(401, '게시글 작성자만 수정할 수 있습니다.');
        }
        return new PostDTO(
            posts.post_id,
            posts.title,
            posts.content,
            posts.created_at,
            posts.like_count,
            posts.view_count,
            posts.imageurl,
        );
    }

    @withConnection(false)
    async like(postId: number, userId: number): Promise<void> {
        const likeDAO = this.daofactory.getDAO(LikeDAO);
        await likeDAO.updateLike(userId, postId);
    }

    @withConnection(false)
    async unlike(postId: number, userId: number): Promise<void> {
        const likeDAO = this.daofactory.getDAO(LikeDAO);
        await likeDAO.deleteLike(userId, postId);
    }

    @withConnection(false)
    async comment(postId: number, userId: number, content: string): Promise<UserDTO> {
        const commentDAO = this.daofactory.getDAO(ReplyDAO);
        const postDAO = this.daofactory.getDAO(PostDAO);
        await commentDAO.createComment(postId, userId, content);
        const { user_id } = await postDAO.getPostDetailsYN(postId);
        return new UserDTO(user_id);
    }

    @withConnection(false)
    async deletecomment(commentId: number, userId: number): Promise<void> {
        const commentDAO = this.daofactory.getDAO(ReplyDAO);

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