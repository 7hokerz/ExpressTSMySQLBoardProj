"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResponseDTO = exports.PostRequestDTO = void 0;
const class_validator_1 = require("class-validator");
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["LIKED"] = "LIKED";
    LikeStatus["NOT_LIKED"] = "NOT_LIKED";
})(LikeStatus || (LikeStatus = {}));
class PostRequestDTO {
}
exports.PostRequestDTO = PostRequestDTO;
class PostResponseDTO {
    constructor(post_id, // 게시물 ID
    created_at, // 게시물 작성일
    like_count, // 좋아요 수
    view_count, // 조회수
    title, // 게시물 제목
    content, // 게시물 내용
    imageurl, // 이미지 주소
    stat) {
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
exports.PostResponseDTO = PostResponseDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PostResponseDTO.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PostResponseDTO.prototype, "imageurl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PostResponseDTO.prototype, "stat", void 0);
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
