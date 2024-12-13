import { withDB, Transaction  } from "../decorators";
import { HttpError } from '../errors';
import { CommentDTO, PostDetailsDTO, PostDTO, UserDTO } from '../domain/entities';
import { DAOFactory, PostDAO, LikeDAO, ReplyDAO } from '../daos';
import { RawComment } from '../utils/types-modules';
import fs from 'fs/promises';
import path from 'path';

@withDB
export default class PostService {
    private daofactory!: DAOFactory;

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

    async newpost(post: PostDTO, user_id: number): Promise<void> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        await postDAO.createPost(post, user_id);
    }

    async postdetail(postId: number, userId: number): Promise<PostDetailsDTO> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        const likeDAO = this.daofactory.getDAO(LikeDAO);

        const [postData, stat] = await Promise.all([
            postDAO.getPostDetails(postId),
            likeDAO.getLikeYN(userId, postId)
        ]);
        
        if(!postData) {
            throw new HttpError(404, 'Post Not Found');
        }
        const { posts, comments } = postData;

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
    
    @Transaction
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

        if(post.imageurl) {
            try {
                const imagePath = path.join(process.cwd(), post.imageurl);
                // 파일 존재 확인
                await fs.access(imagePath);
                // 파일 삭제
                await fs.unlink(imagePath);
            } catch (error) {
                console.log(`이미지가 없음.`, error);
                throw new Error;
            }
        }

        await likeDAO.deleteLikeAll(postId);
        await commentDAO.deleteCommentAll(postId);
        await postDAO.deletePost(postId);
    }

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

    async renderUpdate(postId: number, userId: number): Promise<PostDTO> {  
        const postDAO = this.daofactory.getDAO(PostDAO);

        const [posts] = await postDAO.getPostDetails(postId);

        if(!posts){
            throw new HttpError(404, '게시글이 없습니다.');
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

    async like(postId: number, userId: number): Promise<void> {
        const likeDAO = this.daofactory.getDAO(LikeDAO);
        await likeDAO.updateLike(userId, postId);
    }

    async unlike(postId: number, userId: number): Promise<void> {
        const likeDAO = this.daofactory.getDAO(LikeDAO);
        await likeDAO.deleteLike(userId, postId);
    }

    async comment(postId: number, userId: number, content: string): Promise<UserDTO> {
        const commentDAO = this.daofactory.getDAO(ReplyDAO);
        const postDAO = this.daofactory.getDAO(PostDAO);
        await commentDAO.createComment(postId, userId, content);
        const { user_id } = await postDAO.getPostDetailsYN(postId);
        return new UserDTO(user_id);
    }

    async deletecomment(commentId: number, userId: number): Promise<void> {
        const commentDAO = this.daofactory.getDAO(ReplyDAO);

        const pubId = await commentDAO.getComment(commentId);
        if(!pubId) {
            throw new HttpError(404, '댓글이 없습니다.');
        }

        if(pubId.user_id !== userId){
            throw new HttpError(401, '댓글 작성자만 삭제할 수 있습니다.');
        }
        await commentDAO.deleteComment(commentId);
    }
}