"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDetailsDTO = void 0;
// 특정 게시물 정보(게시물, 댓글, 좋아요 등)
class PostDetailsDTO {
    constructor(post, // 게시물 객체
    postUser, // 게시물 작성자 객체
    comment // 댓글 객체
    ) {
        this.post = post;
        this.postUser = postUser;
        this.comment = comment;
    }
}
exports.PostDetailsDTO = PostDetailsDTO;
