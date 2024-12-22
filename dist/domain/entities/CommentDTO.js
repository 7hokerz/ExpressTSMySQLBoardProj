"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentResponseDTO = exports.CommentRequestDTO = void 0;
class CommentRequestDTO {
}
exports.CommentRequestDTO = CommentRequestDTO;
class CommentResponseDTO {
    constructor(commentUser, comment_id, content, created_at) {
        this.commentUser = commentUser;
        this.comment_id = comment_id;
        this.content = content;
        this.created_at = created_at;
    }
}
exports.CommentResponseDTO = CommentResponseDTO;
/*export class CommentDTO {
    constructor(
        readonly commentUser: UserDTO, //댓글 작성자 객체
        readonly comment_id: number, // 댓글 ID
        readonly content: string, // 댓글 내용
        readonly created_at: Date, // 작성 날짜
    ) {}
}*/ 
