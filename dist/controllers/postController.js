"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const services_1 = require("../services");
const shared_modules_1 = require("../utils/shared-modules");
const SSERepository_1 = __importDefault(require("../utils/SSERepository"));
class PostController {
    constructor() {
        this.postService = new services_1.PostService();
    }
    posts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.postService.posts();
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
                yield this.postService.newpost(post, user_id);
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
                const postData = yield this.postService.postdetail(postId, userId);
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
                yield this.postService.deletepost(postId, userId);
                res.status(200).json({
                    ok: true
                });
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
                yield this.postService.updatepost(postId, userId, title, content);
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
                const post = yield this.postService.renderUpdate(postId, userId);
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
                yield this.postService.like(postId, userId);
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
                yield this.postService.unlike(postId, userId);
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
                const Data = yield this.postService.comment(postId, userId, content);
                SSERepository_1.default.notifyClients(Data.user_id, { postId, userId, content });
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
                yield this.postService.deletecomment(Number(commentId), userId);
                res.status(200).json({
                    ok: true
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    sse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user_id;
            if (!userId) {
                res.status(401).end();
                return;
            }
            res.setHeader('Content-Type', 'text/event-stream'); // 이벤트 스트림
            res.setHeader('Cache-Control', 'no-cache'); // 캐시 없음
            res.setHeader('Connection', 'keep-alive'); // 연결 유지
            res.flushHeaders();
            // Add client connection
            SSERepository_1.default.addClient(userId, res);
            req.on('close', () => {
                SSERepository_1.default.removeClient(userId, res);
            });
        });
    }
}
exports.default = PostController;
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "posts", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "newpost", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "postdetail", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletepost", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatepost", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "renderUpdate", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "like", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "unlike", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "comment", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletecomment", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "sse", null);
