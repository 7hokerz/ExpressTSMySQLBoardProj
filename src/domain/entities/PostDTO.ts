import { IsString, IsNumber, IsOptional, IsDate } from "class-validator";

enum LikeStatus {
    LIKED = 'LIKED',
    NOT_LIKED = 'NOT_LIKED'
}

export class PostRequestDTO {

}

export class PostResponseDTO {
    readonly post_id: number;  // 게시물 ID
    readonly created_at: Date; // 게시물 작성일
    readonly like_count: number; // 좋아요 수
    readonly view_count: number; // 조회수
    readonly title: string; // 게시물 제목

    @IsOptional()
    readonly content?: string; // 게시물 내용

    @IsOptional()
    readonly imageurl?: string; // 이미지 주소

    @IsOptional()
    readonly stat?: string; // 현재 유저의 좋아요 유무

    constructor(
        post_id: number,  // 게시물 ID
        created_at: Date, // 게시물 작성일
        like_count: number, // 좋아요 수
        view_count: number, // 조회수
        title: string, // 게시물 제목
        content?: string, // 게시물 내용
        imageurl?: string, // 이미지 주소
        stat?: LikeStatus, // 현재 유저의 좋아요 유무
    ) {
        this.post_id = post_id;
        this.created_at = created_at;
        this.like_count = like_count;
        this.view_count = view_count;
        this.title = title;
        this.content = content;
        this.imageurl = imageurl;
        this.stat = stat;
    }
}


/*export class PostDTO {
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
}*/