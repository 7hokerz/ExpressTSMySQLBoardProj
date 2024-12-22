"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const upload_1 = require("../config/upload");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
const postController = tsyringe_1.container.resolve(controllers_1.PostController);
const imageController = tsyringe_1.container.resolve(controllers_1.ImageController);
router.route('/upload') // 이미지 업로드에 대한 라우터
    .get((req, res) => { res.render('panels/upload-image'); })
    .post(upload_1.upload.single('image'), imageController.uploadImage);
router.use(upload_1.upload.none()); // 이미지 외 작업의 경우에 적용
router.get('/', postController.paginatedPosts); // 게시글 목록 페이지 렌더링
router.route('/new') // 게시글 작성 요청 라우터
    .get((req, res) => { res.render('newPost'); })
    .post(imageController.saveImage, postController.newpost);
router.route('/:postId') // 게시글 세부 페이지 렌더링 및 게시글 삭제 요청 라우터
    .get(postController.postdetail)
    .delete(postController.deletepost);
router.route('/:postId/update') // 게시글 수정 라우터
    .get(postController.renderUpdate)
    .put(postController.updatepost);
router.route('/:postId/like') // 좋아요 기능 라우터
    .post(postController.like)
    .delete(postController.unlike);
router.post('/:postId/comment', postController.comment); // 댓글 생성 라우터
router.delete('/:postId/comment/:commentId', postController.deletecomment); // 댓글 삭제 라우터
router.get('/notifications/stream', postController.sse); // 실시간 알림
exports.default = router;
/**
 *
 *
 *
 *
 */ 
