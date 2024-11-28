// 게시물 정보
class PostDTO {
    post_id: number;
    title: string;
    content: string | null;
    imageurl?: string | null;
    created_at: Date;
    like_count: number;
    view_count: number;
    stat?: string;

    constructor( 
        post_id: number,
        title: string,
        content: string | null,
        created_at: Date,
        like_count: number,
        view_count: number,
        imageurl: string | null = null
    ) {
        this.post_id = post_id; // 게시물 ID
        this.title = title; // 게시물 제목
        this.content = content; // 게시물 내용
        this.imageurl = imageurl; // 이미지 주소
        this.created_at = created_at; // 게시물 작성일
        this.like_count = like_count; // 좋아요 수
        this.view_count = view_count; // 조회수
    }
}

// 특정 게시물 정보(게시물, 댓글, 좋아요 등)
class PostDetailsDTO {
    post: PostDTO;
    postUser: UserDTO;
    comment: CommentDTO[];

    constructor(post: PostDTO, postUser: UserDTO, comment: CommentDTO[]) {
        this.post = post; // 게시물 객체
        this.postUser = postUser; // 게시물 작성자 객체
        this.comment = comment; // 댓글 객체
    }
}

// 댓글 정보
class CommentDTO {
    commentUser: UserDTO;
    comment_id: number;
    content: string;
    created_at: Date;

    constructor(
        commentUser: UserDTO, 
        comment_id: number, 
        content: string, 
        created_at: Date
    ) {
        this.commentUser = commentUser; //댓글 작성자 객체
        this.comment_id = comment_id; // 댓글 ID
        this.content = content; // 댓글 내용
        this.created_at = created_at; // 작성 날짜
    }
}

// 사용자 정보
class UserDTO { 
    #pwd: string | null; // 비밀번호 외부 노출 방지
    user_id: number;
    username: string | null;

    constructor(user_id: number, username: string | null = null, pwd: string | null = null){
        this.user_id = user_id; // 유저 ID
        this.username = username; // 유저 ID
        this.#pwd = pwd; // 비밀번호
    }

    getPwd(): string | null { 
        return this.#pwd;
    }
}

export {
    PostDTO,
    PostDetailsDTO,
    CommentDTO,
    UserDTO,
}