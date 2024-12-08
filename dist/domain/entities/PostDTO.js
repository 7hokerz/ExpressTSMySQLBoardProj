"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDTO = void 0;
class PostDTO {
    constructor(post_id, // 게시물 ID
    title, // 게시물 제목
    content, // 게시물 내용
    created_at, // 게시물 작성일
    like_count, // 좋아요 수
    view_count, // 조회수
    imageurl, // 이미지 주소
    stat) {
        this.post_id = post_id;
        this.title = title;
        this.content = content;
        this.created_at = created_at;
        this.like_count = like_count;
        this.view_count = view_count;
        this.imageurl = imageurl;
        this.stat = stat;
    }
}
exports.PostDTO = PostDTO;
