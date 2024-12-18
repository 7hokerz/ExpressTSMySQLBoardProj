import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { PostService } from "../services";
import { ExtendedReq } from '../utils/types-modules';
import { AsyncWrapper, autoBind } from "../decorators";
import SSEUtil from "../utils/SSEUtil";
import { ResponseHandler } from "../middlewares";
import { UnauthorizedError } from "../errors";

@injectable()
@autoBind
@AsyncWrapper
export default class PostController {
    constructor (
        @inject(PostService) private postService: PostService,
        @inject(SSEUtil) private SSE: SSEUtil
    ) {}
    
    // 타입 가드 사용
    private checkUserId(userId: number | undefined): asserts userId is number {
        if(!userId) {
            throw new UnauthorizedError();
        }
    }

    /*
    async posts(req: Request, res: Response, next: NextFunction): Promise<void> {
        const posts = await this.postService.posts();
        res.render('index', { posts });
    }
    */

    async paginatedPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        const page = Number(req.query.page) || 1; // 현재 페이지
        const limit = Number(req.query.limit) || 4; // 게시글 개수 제한

        const { posts, totalPages } = await this.postService.paginatedPosts(page, limit);
        
        res.render('index', { 
            posts, 
            currentPage: page,
            totalPages
        });
    }
    
    async newpost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [post, userId] = [req.body, req.user_id];
        this.checkUserId(userId);

        await this.postService.newpost(post, userId);
        res.redirect('/posts');
    }

    async postdetail(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        this.checkUserId(userId);
       
        const postData = await this.postService.postdetail(postId, userId);

        res.render('postDetails', {
            post: postData.post, 
            postUser: postData.postUser, 
            comment: postData.comment, 
            error: null
        });
    }

    async deletepost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        this.checkUserId(userId);

        await this.postService.deletepost(postId, userId);
        res.status(200).json(ResponseHandler.success(null));
    }

    async updatepost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        this.checkUserId(userId);
        const { title, content } = req.body;
       
        await this.postService.updatepost(postId, userId, title, content);
        res.redirect(`/posts/${postId}`);
    }

    async renderUpdate(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        this.checkUserId(userId);
        const post = await this.postService.renderUpdate(postId, userId);
        res.render('updatePost', { post });
    }

    async like(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        this.checkUserId(userId);
        await this.postService.like(postId, userId);
        res.json(ResponseHandler.success(null));
    }

    async unlike(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        this.checkUserId(userId);
        await this.postService.unlike(postId, userId);
        res.json(ResponseHandler.success(null));
    }

    async comment(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        this.checkUserId(userId);
        const { content } = req.body;
       
        const Data = await this.postService.comment(postId, userId, content);
        this.SSE.notifyClients(Data.user_id, { postId, userId, content });
        res.redirect(`/posts/${postId}`);
    }

    async deletecomment(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [{ commentId }, userId] = [req.params, req.user_id];
        this.checkUserId(userId);

        await this.postService.deletecomment(Number(commentId), userId);
        res.status(200).json(ResponseHandler.success(null));
    }

    async sse(req: ExtendedReq, res: Response): Promise<void> {
        const userId = req.user_id;
        if(!userId) {
            res.status(401).end();
            return;
        }
        res.setHeader('Content-Type', 'text/event-stream'); // 이벤트 스트림
        res.setHeader('Cache-Control', 'no-cache'); // 캐시 없음
        res.setHeader('Connection', 'keep-alive'); // 연결 유지
        res.flushHeaders(); // 즉시 전송

        this.SSE.addClient(userId, res);

        req.on('close', () => { // 창이 닫히면 연결 종료
            this.SSE.removeClient(userId, res);
        });
    }
}

/**
 * 
 * 
 * 
 * 
 * comment
 * -
 * 
 * sse
 * - 알림을 받기 위한 응답 객체 헤더 설정 및 클라이언트 연결
 * 
 * 
 */
