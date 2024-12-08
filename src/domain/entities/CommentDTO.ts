import { UserDTO } from "./UserDTO";

export class CommentDTO {
    constructor(
        readonly commentUser: UserDTO, //댓글 작성자 객체
        readonly comment_id: number, // 댓글 ID
        readonly content: string, // 댓글 내용
        readonly created_at: Date, // 작성 날짜
    ) {}
}