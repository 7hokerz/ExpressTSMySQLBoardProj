import { CommentResponseDTO } from "./CommentDTO";
import { UserResponseDto } from "./UserDTO";
import { PostResponseDTO } from "./PostDTO";

// 특정 게시물 정보(게시물, 댓글, 좋아요 등)
export class PostDetailsResponseDTO {
    constructor(
        readonly post: PostResponseDTO,  // 게시물 객체
        readonly postUser: UserResponseDto, // 게시물 작성자 객체
        readonly comment: CommentResponseDTO[] // 댓글 객체
    ) {}
}

// 특정 게시물 정보(게시물, 댓글, 좋아요 등)
/*export class PostDetailsDTO {
    constructor(
        readonly post: PostDTO,  // 게시물 객체
        readonly postUser: UserDTO, // 게시물 작성자 객체
        readonly comment: CommentDTO[] // 댓글 객체
    ) {}
}*/