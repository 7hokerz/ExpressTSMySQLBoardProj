import { Request, Response, NextFunction } from "express";
import { PostService } from "../services";
import { ExtendedReq } from '../utils/types-modules';
import { autoBind } from "../utils/shared-modules";
import SSERepository from "../utils/SSERepository";

export default class PostController{
    private postService: PostService = new PostService();

    @autoBind 
    async posts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const posts = await this.postService.posts();
            res.render('index', { posts });
        } catch (error) {
            next(error);
        }
    }

    @autoBind 
    async newpost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [post, user_id] = [req.body, req.user_id];
        try {
            await this.postService.newpost(post, user_id!);
            res.redirect('/posts');
        } catch (error) {
            next(error);
        }
    }

    @autoBind 
    async postdetail(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            const postData = await this.postService.postdetail(postId, userId!);

            res.render('postDetails', {
                post: postData.post, 
                postUser: postData.postUser, 
                comment: postData.comment, 
                error: null
            });
        } catch (error) {
            next(error);
        }
    }

    @autoBind 
    async deletepost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            await this.postService.deletepost(postId, userId!);
            res.status(200).json({
                ok: true
            });
        } catch(error) {
            next(error);
        }
    }

    @autoBind 
    async updatepost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        const { title, content } = req.body;
        try {
            await this.postService.updatepost(postId, userId!, title, content);
            res.redirect(`/posts/${postId}`);
        }catch(error) {
            next(error);
        }
    }

    @autoBind 
    async renderUpdate(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try{
            const post = await this.postService.renderUpdate(postId, userId!);
            res.render('updatePost', { post });
        }catch(error){
            next(error);
        }
    }

    @autoBind 
    async like(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            await this.postService.like(postId, userId!);
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            next(error);
        }
    }

    @autoBind 
    async unlike(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            await this.postService.unlike(postId, userId!);
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            next(error);
        }
    }

    @autoBind 
    async comment(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        const { content } = req.body;
        try {
            const Data = await this.postService.comment(postId, userId!, content);
            SSERepository.notifyClients(Data.user_id, { postId, userId, content });
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            next(error);
        }
    }

    @autoBind 
    async deletecomment(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [{postId, commentId}, userId] = [req.params, req.user_id];
        try {
            await this.postService.deletecomment(Number(commentId), userId!);
            res.status(200).json({
                ok: true
            });
        } catch (error) {
            next(error);
        }
    }

    @autoBind
    async sse(req: ExtendedReq, res: Response): Promise<void> {
        const userId = req.user_id;

        if(!userId) {
            res.status(401).end();
            return;
        }

        res.setHeader('Content-Type', 'text/event-stream'); // 이벤트 스트림
        res.setHeader('Cache-Control', 'no-cache'); // 캐시 없음
        res.setHeader('Connection', 'keep-alive'); // 연결 유지
        res.flushHeaders();

        // Add client connection
        SSERepository.addClient(userId, res);

        req.on('close', () => {
            SSERepository.removeClient(userId, res);
        });
    }
}


