"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postService_1 = __importDefault(require("../services/postService"));
class postController {
    posts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postService_1.default.posts();
                res.render('index', { posts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    newpost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [post, user_id] = [req.body, req.user_id];
            try {
                yield postService_1.default.newpost(post, user_id);
                res.redirect('/posts');
            }
            catch (error) {
                next(error);
            }
        });
    }
    postdetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            try {
                const postData = yield postService_1.default.postdetail(postId, userId);
                res.render('postDetails', {
                    post: postData.post,
                    postUser: postData.postUser,
                    comment: postData.comment,
                    error: null
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletepost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            try {
                yield postService_1.default.deletepost(postId, userId);
                res.redirect('/posts');
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatepost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            const { title, content } = req.body;
            try {
                yield postService_1.default.updatepost(postId, userId, title, content);
                res.redirect(`/posts/${postId}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
    renderUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            try {
                const post = yield postService_1.default.renderUpdate(postId, userId);
                res.render('updatePost', { post });
            }
            catch (error) {
                next(error);
            }
        });
    }
    like(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            try {
                yield postService_1.default.like(postId, userId);
                res.redirect(`/posts/${postId}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
    unlike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            try {
                yield postService_1.default.unlike(postId, userId);
                res.redirect(`/posts/${postId}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
    comment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            const { content } = req.body;
            try {
                yield postService_1.default.comment(postId, userId, content);
                res.redirect(`/posts/${postId}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletecomment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ postId, commentId }, userId] = [req.params, req.user_id];
            try {
                yield postService_1.default.deletecomment(Number(commentId), userId);
                res.redirect(`/posts/${postId}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new postController();
