import { Request, Response, NextFunction } from "express";
import postService from "../services/postService";
import { ExtendedReq } from '../utils/types-modules';

class postController{
    async posts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const posts = await postService.posts();
            res.render('index', { posts });
        } catch (error) {
            next(error);
        }
    }

    async newpost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [post, user_id] = [req.body, req.user_id];
        try {
            await postService.newpost(post, user_id!);
            res.redirect('/posts');
        } catch (error) {
            next(error);
        }
    }

    async postdetail(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            const postData = await postService.postdetail(postId, userId!);

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

    async deletepost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            await postService.deletepost(postId, userId!);
            res.redirect('/posts');
        } catch(error) {
            next(error);
        }
    }

    async updatepost(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        const { title, content } = req.body;
        try {
            await postService.updatepost(postId, userId!, title, content);
            res.redirect(`/posts/${postId}`);
        }catch(error) {
            next(error);
        }
    }

    async renderUpdate(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try{
            const post = await postService.renderUpdate(postId, userId!);
            res.render('updatePost', { post });
        }catch(error){
            next(error);
        }
    }

    async like(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            await postService.like(postId, userId!);
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            next(error);
        }
    }

    async unlike(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        try {
            await postService.unlike(postId, userId!);
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            next(error);
        }
    }

    async comment(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [postId, userId] = [Number(req.params.postId), req.user_id];
        const { content } = req.body;
        try {
            await postService.comment(postId, userId!, content);
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            next(error);
        }
    }

    async deletecomment(req: ExtendedReq, res: Response, next: NextFunction): Promise<void> {
        const [{postId, commentId}, userId] = [req.params, req.user_id];
        try {
            await postService.deletecomment(Number(commentId), userId!);
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            next(error);
        }
    }
}

export default new postController();