import fs from 'fs/promises';
import path from 'path';
import { injectable } from "tsyringe";
import { withDB, Transaction } from "../decorators";
import { NotFoundError, UnauthorizedError } from '../errors';
import { CommentResponseDTO, PostDetailsResponseDTO, PostResponseDTO, UserResponseDto } from '../domain/entities';
import { DAOFactory, PostDAO, LikeDAO, ReplyDAO } from '../daos';

@injectable()
@withDB
export default class PostService {
    private daofactory!: DAOFactory;
    
    async paginatedPosts(page: number, limit: number): Promise<{
        posts: PostResponseDTO[];
        totalPages: number;
    }> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        const offset = (page - 1) * limit;
        const posts = await postDAO.getPaginatedPosts(limit, offset);
        const [postsCount] = await postDAO.getPostsCount();
        
        return {
            posts: posts.map((post: PostResponseDTO) => new PostResponseDTO(
                post.post_id,
                post.created_at,
                post.like_count,
                post.view_count,
                post.title,
            )),
            totalPages: Math.ceil(postsCount.total_posts / limit),
        };
    }

    async newpost(post: any, userId: number): Promise<void> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        const base64Pattern = /<img[^>]*src="/g;
        
        post.content = post.content.replace(base64Pattern, () => {
            return `<img src="/uploads/${post.imagePath}`;
        });
        
        await postDAO.createPost(post, userId);
    }

    async postdetail(postId: number, userId: number): Promise<PostDetailsResponseDTO> {
        const postDAO = this.daofactory.getDAO(PostDAO);
        const likeDAO = this.daofactory.getDAO(LikeDAO);

        const [postData, stat] = await Promise.all([
            postDAO.getPostDetails(postId),
            likeDAO.getPostLikeInfo(userId, postId)
        ]);
        
        if(!postData) {
            throw new NotFoundError('Post Not Found');
        }
        const { posts, comments } = postData;

        return new PostDetailsResponseDTO(
            new PostResponseDTO(
                posts.post_id,
                posts.created_at,
                posts.like_count,
                posts.view_count,
                posts.title,
                posts.content,
                posts.imageurl,
                stat,
            ),
            new UserResponseDto(
                posts.user_id,
                posts.username,
            ),
            (comments).map(
                (comment: any) => new CommentResponseDTO(
                    new UserResponseDto(
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
            throw new NotFoundError('Post Not Found');
        }

        if(post.user_id !== userId){
            throw new UnauthorizedError();
        }

        if(post.imageurl) {
            try {
                const imagePath = path.join(process.cwd(), `/uploads/${post.imageurl}`);
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
            throw new UnauthorizedError();
        }

        if(post !== null && post !== undefined){
            const update = { post_id, title, content };
            await postDAO.updatePost(update);
        }
    }

    async renderUpdate(postId: number, userId: number): Promise<PostResponseDTO> {  
        const postDAO = this.daofactory.getDAO(PostDAO);

        const {posts} = await postDAO.getPostDetails(postId);

        if(!posts){
            throw new NotFoundError('게시글이 없습니다.');
        }
        
        if(posts.user_id !== userId){
            throw new UnauthorizedError();
        }
        return new PostResponseDTO(
            posts.post_id,
            posts.created_at,
            posts.like_count,
            posts.view_count,
            posts.title,
            posts.content,
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

    async comment(postId: number, userId: number, content: string): Promise<UserResponseDto> {
        const commentDAO = this.daofactory.getDAO(ReplyDAO);
        const postDAO = this.daofactory.getDAO(PostDAO);
        await commentDAO.createComment(postId, userId, content);
        const { user_id } = await postDAO.getPostDetailsYN(postId);
        return new UserResponseDto(
            user_id
        );
    }

    async deletecomment(commentId: number, userId: number): Promise<void> {
        const commentDAO = this.daofactory.getDAO(ReplyDAO);

        const pubId = await commentDAO.getComment(commentId);
        
        if(!pubId) {
            throw new NotFoundError('댓글이 없습니다.');
        }

        if(pubId.user_id !== userId){
            throw new UnauthorizedError();
        }
        await commentDAO.deleteComment(commentId);
    }
}