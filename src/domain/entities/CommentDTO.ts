import { IsString, IsNumber, IsDate } from "class-validator";
import { UserResponseDto } from "./UserDTO";

export class CommentRequestDTO {

}

export class CommentResponseDTO {
    readonly commentUser: UserResponseDto; //댓글 작성자 객체

    readonly comment_id: number; // 댓글 ID
    readonly content: string; // 댓글 내용
    readonly created_at: Date; // 작성 날짜

    constructor(commentUser: UserResponseDto, comment_id: number, content: string, created_at: Date) {
        this.commentUser = commentUser;
        this.comment_id = comment_id;
        this.content = content;
        this.created_at = created_at;
    }
}

/*export class CommentDTO {
    constructor(
        readonly commentUser: UserDTO, //댓글 작성자 객체
        readonly comment_id: number, // 댓글 ID
        readonly content: string, // 댓글 내용
        readonly created_at: Date, // 작성 날짜
    ) {}
}*/