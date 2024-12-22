"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageType = exports.LikeStatus = void 0;
// 좋아요 상태 정의
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["LIKED"] = "LIKED";
    LikeStatus["NOT_LIKED"] = "NOT_LIKED";
})(LikeStatus || (exports.LikeStatus = LikeStatus = {}));
// 이미지 파일 타입 정의
var ImageType;
(function (ImageType) {
    ImageType["JPG"] = "jpg";
    ImageType["JPEG"] = "jpeg";
    ImageType["PNG"] = "png";
    ImageType["GIF"] = "gif";
    ImageType["WEBP"] = "webp";
})(ImageType || (exports.ImageType = ImageType = {}));
