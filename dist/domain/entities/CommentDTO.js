"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDTO = void 0;
class CommentDTO {
    constructor(commentUser, //댓글 작성자 객체
    comment_id, // 댓글 ID
    content, // 댓글 내용
    created_at) {
        this.commentUser = commentUser;
        this.comment_id = comment_id;
        this.content = content;
        this.created_at = created_at;
    }
}
exports.CommentDTO = CommentDTO;
