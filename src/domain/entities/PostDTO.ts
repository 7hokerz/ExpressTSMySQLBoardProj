
export class PostDTO {
    constructor( 
        readonly post_id: number,  // 게시물 ID
        readonly title: string, // 게시물 제목
        readonly content: string, // 게시물 내용
        readonly created_at: Date, // 게시물 작성일
        readonly like_count: number, // 좋아요 수
        readonly view_count: number, // 조회수
        readonly imageurl?: string, // 이미지 주소
        readonly stat?: string, // 현재 유저의 좋아요 유무
    ) {}
}