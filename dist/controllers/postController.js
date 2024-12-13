"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const tsyringe_1 = require("tsyringe");
const services_1 = require("../services");
const decorators_1 = require("../decorators");
const SSEUtil_1 = __importDefault(require("../utils/SSEUtil"));
let PostController = class PostController {
    constructor() {
        this.postService = new services_1.PostService();
        this.SSE = tsyringe_1.container.resolve(SSEUtil_1.default);
    }
    posts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.postService.posts();
            res.render('index', { posts });
        });
    }
    newpost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [post, user_id] = [req.body, req.user_id];
            yield this.postService.newpost(post, user_id);
            res.redirect('/posts');
        });
    }
    postdetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            const postData = yield this.postService.postdetail(postId, userId);
            res.render('postDetails', {
                post: postData.post,
                postUser: postData.postUser,
                comment: postData.comment,
                error: null
            });
        });
    }
    deletepost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            yield this.postService.deletepost(postId, userId);
            res.status(200).json({
                ok: true
            });
        });
    }
    updatepost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            const { title, content } = req.body;
            yield this.postService.updatepost(postId, userId, title, content);
            res.redirect(`/posts/${postId}`);
        });
    }
    renderUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            const post = yield this.postService.renderUpdate(postId, userId);
            res.render('updatePost', { post });
        });
    }
    like(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            yield this.postService.like(postId, userId);
            res.redirect(`/posts/${postId}`);
        });
    }
    unlike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            yield this.postService.unlike(postId, userId);
            res.redirect(`/posts/${postId}`);
        });
    }
    comment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            const { content } = req.body;
            const Data = yield this.postService.comment(postId, userId, content);
            this.SSE.notifyClients(Data.user_id, { postId, userId, content });
            res.redirect(`/posts/${postId}`);
        });
    }
    deletecomment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ postId, commentId }, userId] = [req.params, req.user_id];
            yield this.postService.deletecomment(Number(commentId), userId);
            res.status(200).json({
                ok: true
            });
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
            res.flushHeaders(); // 즉시 전송
            this.SSE.addClient(userId, res);
            req.on('close', () => {
                this.SSE.removeClient(userId, res);
            });
        });
    }
};
PostController = __decorate([
    decorators_1.autoBind,
    decorators_1.AsyncHandler
], PostController);
exports.default = PostController;
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
