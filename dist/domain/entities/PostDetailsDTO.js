"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDetailsResponseDTO = void 0;
// 특정 게시물 정보(게시물, 댓글, 좋아요 등)
class PostDetailsResponseDTO {
    constructor(post, // 게시물 객체
    postUser, // 게시물 작성자 객체
    comment // 댓글 객체
    ) {
        this.post = post;
        this.postUser = postUser;
        this.comment = comment;
    }
}
exports.PostDetailsResponseDTO = PostDetailsResponseDTO;
// 특정 게시물 정보(게시물, 댓글, 좋아요 등)
/*export class PostDetailsDTO {
    constructor(
        readonly post: PostDTO,  // 게시물 객체
        readonly postUser: UserDTO, // 게시물 작성자 객체
        readonly comment: CommentDTO[] // 댓글 객체
    ) {}
}*/ 
