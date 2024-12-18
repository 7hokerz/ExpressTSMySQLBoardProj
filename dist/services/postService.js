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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const tsyringe_1 = require("tsyringe");
const decorators_1 = require("../decorators");
const errors_1 = require("../errors");
const entities_1 = require("../domain/entities");
const daos_1 = require("../daos");
let PostService = class PostService {
    /*
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
    */
    paginatedPosts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDAO = this.daofactory.getDAO(daos_1.PostDAO);
            const offset = (page - 1) * limit;
            const posts = yield postDAO.getPaginatedPosts(limit, offset);
            const [postsCount] = yield postDAO.getPostsCount();
            return {
                posts: posts.map((post) => new entities_1.PostResponseDTO(post.post_id, post.title, post.content, post.created_at, post.like_count, post.view_count)),
                totalPages: Math.ceil(postsCount.total_posts / limit),
            };
        });
    }
    newpost(post, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDAO = this.daofactory.getDAO(daos_1.PostDAO);
            yield postDAO.createPost(post, userId);
        });
    }
    postdetail(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDAO = this.daofactory.getDAO(daos_1.PostDAO);
            const likeDAO = this.daofactory.getDAO(daos_1.LikeDAO);
            const [postData, stat] = yield Promise.all([
                postDAO.getPostDetails(postId),
                likeDAO.getPostLikeInfo(userId, postId)
            ]);
            if (!postData) {
                throw new errors_1.NotFoundError('Post Not Found');
            }
            const { posts, comments } = postData;
            return new entities_1.PostDetailsResponseDTO(new entities_1.PostResponseDTO(posts.post_id, posts.title, posts.content, posts.created_at, posts.like_count, posts.view_count, posts.imageurl, stat), new entities_1.UserResponseDto(posts.user_id, posts.username), (comments).map((comment) => new entities_1.CommentResponseDTO(new entities_1.UserResponseDto(comment.user_id, comment.username), comment.comment_id, comment.content, comment.created_at)));
        });
    }
    deletepost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDAO = this.daofactory.getDAO(daos_1.PostDAO);
            const likeDAO = this.daofactory.getDAO(daos_1.LikeDAO);
            const commentDAO = this.daofactory.getDAO(daos_1.ReplyDAO);
            const post = yield postDAO.getPostDetailsYN(postId);
            if (post === null || post === undefined) {
                throw new errors_1.NotFoundError('Post Not Found');
            }
            if (post.user_id !== userId) {
                throw new errors_1.UnauthorizedError();
            }
            if (post.imageurl) {
                try {
                    const imagePath = path_1.default.join(process.cwd(), post.imageurl);
                    // 파일 존재 확인
                    yield promises_1.default.access(imagePath);
                    // 파일 삭제
                    yield promises_1.default.unlink(imagePath);
                }
                catch (error) {
                    console.log(`이미지가 없음.`, error);
                    throw new Error;
                }
            }
            yield likeDAO.deleteLikeAll(postId);
            yield commentDAO.deleteCommentAll(postId);
            yield postDAO.deletePost(postId);
        });
    }
    updatepost(post_id, userId, title, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDAO = this.daofactory.getDAO(daos_1.PostDAO);
            const post = yield postDAO.getPostDetailsYN(post_id);
            if ((post !== null && post !== undefined) && post.user_id !== userId) {
                throw new errors_1.UnauthorizedError();
            }
            if (post !== null && post !== undefined) {
                const update = { post_id, title, content };
                yield postDAO.updatePost(update);
            }
        });
    }
    renderUpdate(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDAO = this.daofactory.getDAO(daos_1.PostDAO);
            const [posts] = yield postDAO.getPostDetails(postId);
            if (!posts) {
                throw new errors_1.NotFoundError('게시글이 없습니다.');
            }
            if (posts.user_id !== userId) {
                throw new errors_1.UnauthorizedError();
            }
            return new entities_1.PostResponseDTO(posts.post_id, posts.title, posts.content, posts.created_at, posts.like_count, posts.view_count, posts.imageurl);
        });
    }
    like(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeDAO = this.daofactory.getDAO(daos_1.LikeDAO);
            yield likeDAO.updateLike(userId, postId);
        });
    }
    unlike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeDAO = this.daofactory.getDAO(daos_1.LikeDAO);
            yield likeDAO.deleteLike(userId, postId);
        });
    }
    comment(postId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDAO = this.daofactory.getDAO(daos_1.ReplyDAO);
            const postDAO = this.daofactory.getDAO(daos_1.PostDAO);
            yield commentDAO.createComment(postId, userId, content);
            const { user_id } = yield postDAO.getPostDetailsYN(postId);
            return new entities_1.UserResponseDto(user_id);
        });
    }
    deletecomment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDAO = this.daofactory.getDAO(daos_1.ReplyDAO);
            const pubId = yield commentDAO.getComment(commentId);
            if (!pubId) {
                throw new errors_1.NotFoundError('댓글이 없습니다.');
            }
            if (pubId.user_id !== userId) {
                throw new errors_1.UnauthorizedError();
            }
            yield commentDAO.deleteComment(commentId);
        });
    }
};
__decorate([
    decorators_1.Transaction,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostService.prototype, "deletepost", null);
PostService = __decorate([
    (0, tsyringe_1.injectable)(),
    decorators_1.withDB
], PostService);
exports.default = PostService;
