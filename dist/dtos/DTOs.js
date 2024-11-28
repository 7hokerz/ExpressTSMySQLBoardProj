"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _UserDTO_pwd;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = exports.CommentDTO = exports.PostDetailsDTO = exports.PostDTO = void 0;
// 게시물 정보
class PostDTO {
    constructor(post_id, title, content, created_at, like_count, view_count, imageurl = null) {
        this.post_id = post_id; // 게시물 ID
        this.title = title; // 게시물 제목
        this.content = content; // 게시물 내용
        this.imageurl = imageurl; // 이미지 주소
        this.created_at = created_at; // 게시물 작성일
        this.like_count = like_count; // 좋아요 수
        this.view_count = view_count; // 조회수
    }
}
exports.PostDTO = PostDTO;
// 특정 게시물 정보(게시물, 댓글, 좋아요 등)
class PostDetailsDTO {
    constructor(post, postUser, comment) {
        this.post = post; // 게시물 객체
        this.postUser = postUser; // 게시물 작성자 객체
        this.comment = comment; // 댓글 객체
    }
}
exports.PostDetailsDTO = PostDetailsDTO;
// 댓글 정보
class CommentDTO {
    constructor(commentUser, comment_id, content, created_at) {
        this.commentUser = commentUser; //댓글 작성자 객체
        this.comment_id = comment_id; // 댓글 ID
        this.content = content; // 댓글 내용
        this.created_at = created_at; // 작성 날짜
    }
}
exports.CommentDTO = CommentDTO;
// 사용자 정보
class UserDTO {
    constructor(user_id, username = null, pwd = null) {
        _UserDTO_pwd.set(this, void 0); // 비밀번호 외부 노출 방지
        this.user_id = user_id; // 유저 ID
        this.username = username; // 유저 ID
        __classPrivateFieldSet(this, _UserDTO_pwd, pwd, "f"); // 비밀번호
    }
    getPwd() {
        return __classPrivateFieldGet(this, _UserDTO_pwd, "f");
    }
}
exports.UserDTO = UserDTO;
_UserDTO_pwd = new WeakMap();
