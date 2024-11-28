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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _postService_daofactory;
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
class postService {
    constructor() {
        _postService_daofactory.set(this, void 0);
        __classPrivateFieldSet(this, _postService_daofactory, shared_modules_1.DAOFactory.getInstance(), "f");
    }
    posts() {
        var arguments_1 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_1[arguments_1.length - 1];
            const postDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createPostDAO(connection);
            return yield postDAO.getPosts();
        });
    }
    newpost(post, user_id) {
        var arguments_2 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_2[arguments_2.length - 1];
            const postDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createPostDAO(connection);
            yield postDAO.createPost(post, user_id);
        });
    }
    postdetail(postId, userId) {
        var arguments_3 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_3[arguments_3.length - 1];
            const postDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createPostDAO(connection);
            const likeDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createLikeDAO(connection);
            const [postData, stat] = yield Promise.all([
                postDAO.getPostDetails(postId),
                likeDAO.getLikeYN(userId, postId)
            ]);
            if (!postData) {
                throw new shared_modules_1.HttpError(404, 'Post Not Found');
            }
            // 기존 post 객체에 stat 속성 추가
            postData.post = Object.assign(Object.assign({}, postData.post), { // 기존 속성 유지
                stat });
            return postData;
        });
    }
    deletepost(postId, userId) {
        var arguments_4 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_4[arguments_4.length - 1];
            const postDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createPostDAO(connection);
            const likeDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createLikeDAO(connection);
            const commentDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createCommentDAO(connection);
            const post = yield postDAO.getPostDetailsYN(postId);
            if (post === null || post === undefined) {
                throw new shared_modules_1.HttpError(404, 'Post Not Found');
            }
            if (post.user_id !== userId) {
                throw new shared_modules_1.HttpError(401, '게시글 작성자만 삭제할 수 있습니다.');
            }
            yield likeDAO.deleteLikeAll(postId);
            yield commentDAO.deleteCommentAll(postId);
            yield postDAO.deletePost(postId);
        });
    }
    updatepost(post_id, userId, title, content) {
        var arguments_5 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_5[arguments_5.length - 1];
            const postDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createPostDAO(connection);
            const post = yield postDAO.getPostDetailsYN(post_id);
            if ((post !== null && post !== undefined) && post.user_id !== userId) {
                throw new shared_modules_1.HttpError(401, '게시글 작성자만 수정할 수 있습니다.');
            }
            if (post !== null && post !== undefined) {
                const update = { post_id, title, content };
                yield postDAO.updatePost(update);
            }
        });
    }
    renderUpdate(postId, userId) {
        var arguments_6 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_6[arguments_6.length - 1];
            const postDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createPostDAO(connection);
            const postData = yield postDAO.getPostDetails(postId);
            if (!postData) {
                throw new shared_modules_1.HttpError(404, 'Post Not Found');
            }
            if (postData.postUser.user_id !== userId) {
                throw new shared_modules_1.HttpError(401, '게시글 작성자만 수정할 수 있습니다.');
            }
            return postData.post;
        });
    }
    like(postId, userId) {
        var arguments_7 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_7[arguments_7.length - 1];
            const likeDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createLikeDAO(connection);
            yield likeDAO.updateLike(userId, postId);
        });
    }
    unlike(postId, userId) {
        var arguments_8 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_8[arguments_8.length - 1];
            const likeDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createLikeDAO(connection);
            yield likeDAO.deleteLike(userId, postId);
        });
    }
    comment(postId, userId, content) {
        var arguments_9 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_9[arguments_9.length - 1];
            const commentDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createCommentDAO(connection);
            yield commentDAO.createComment(postId, userId, content);
        });
    }
    deletecomment(commentId, userId) {
        var arguments_10 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_10[arguments_10.length - 1];
            const commentDAO = __classPrivateFieldGet(this, _postService_daofactory, "f").createCommentDAO(connection);
            const pubId = yield commentDAO.getComment(commentId);
            if (!pubId) {
                throw new shared_modules_1.HttpError(404, 'Comment Not Found');
            }
            if (pubId.user_id !== userId) {
                throw new shared_modules_1.HttpError(401, '댓글 작성자만 삭제할 수 있습니다.');
            }
            yield commentDAO.deleteComment(commentId);
        });
    }
}
_postService_daofactory = new WeakMap();
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], postService.prototype, "posts", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shared_modules_1.PostDTO, Number]),
    __metadata("design:returntype", Promise)
], postService.prototype, "newpost", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], postService.prototype, "postdetail", null);
__decorate([
    (0, shared_modules_1.withConnection)(true, shared_modules_1.HttpError, shared_modules_1.TransactionError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], postService.prototype, "deletepost", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], postService.prototype, "updatepost", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], postService.prototype, "renderUpdate", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], postService.prototype, "like", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], postService.prototype, "unlike", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], postService.prototype, "comment", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], postService.prototype, "deletecomment", null);
exports.default = new postService();
/*
    

*/ 
