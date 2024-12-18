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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const middlewares_1 = require("../middlewares");
const errors_1 = require("../errors");
let PostController = class PostController {
    constructor(postService, SSE) {
        this.postService = postService;
        this.SSE = SSE;
    }
    // 타입 가드 사용
    checkUserId(userId) {
        if (!userId) {
            throw new errors_1.UnauthorizedError();
        }
    }
    /*
    async posts(req: Request, res: Response, next: NextFunction): Promise<void> {
        const posts = await this.postService.posts();
        res.render('index', { posts });
    }
    */
    paginatedPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page) || 1; // 현재 페이지
            const limit = Number(req.query.limit) || 4; // 게시글 개수 제한
            const { posts, totalPages } = yield this.postService.paginatedPosts(page, limit);
            res.render('index', {
                posts,
                currentPage: page,
                totalPages
            });
        });
    }
    newpost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [post, userId] = [req.body, req.user_id];
            this.checkUserId(userId);
            yield this.postService.newpost(post, userId);
            res.redirect('/posts');
        });
    }
    postdetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            this.checkUserId(userId);
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
            this.checkUserId(userId);
            yield this.postService.deletepost(postId, userId);
            res.status(200).json(middlewares_1.ResponseHandler.success(null));
        });
    }
    updatepost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            this.checkUserId(userId);
            const { title, content } = req.body;
            yield this.postService.updatepost(postId, userId, title, content);
            res.redirect(`/posts/${postId}`);
        });
    }
    renderUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            this.checkUserId(userId);
            const post = yield this.postService.renderUpdate(postId, userId);
            res.render('updatePost', { post });
        });
    }
    like(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            this.checkUserId(userId);
            yield this.postService.like(postId, userId);
            res.json(middlewares_1.ResponseHandler.success(null));
        });
    }
    unlike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            this.checkUserId(userId);
            yield this.postService.unlike(postId, userId);
            res.json(middlewares_1.ResponseHandler.success(null));
        });
    }
    comment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [postId, userId] = [Number(req.params.postId), req.user_id];
            this.checkUserId(userId);
            const { content } = req.body;
            const Data = yield this.postService.comment(postId, userId, content);
            this.SSE.notifyClients(Data.user_id, { postId, userId, content });
            res.redirect(`/posts/${postId}`);
        });
    }
    deletecomment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ commentId }, userId] = [req.params, req.user_id];
            this.checkUserId(userId);
            yield this.postService.deletecomment(Number(commentId), userId);
            res.status(200).json(middlewares_1.ResponseHandler.success(null));
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
    (0, tsyringe_1.injectable)(),
    decorators_1.autoBind,
    decorators_1.AsyncWrapper,
    __param(0, (0, tsyringe_1.inject)(services_1.PostService)),
    __param(1, (0, tsyringe_1.inject)(SSEUtil_1.default)),
    __metadata("design:paramtypes", [services_1.PostService,
        SSEUtil_1.default])
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
