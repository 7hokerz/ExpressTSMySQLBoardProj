import express, { Request, Response } from 'express';
import { container } from 'tsyringe';
import { upload } from '../config/upload';
import { ImageController, PostController } from '../controllers';

const router = express.Router();

const postController = container.resolve(PostController);
const imageController = container.resolve(ImageController);

router.route('/upload') // 이미지 업로드에 대한 라우터
    .get((req: Request, res: Response) => {res.render('panels/upload-image');})
    .post(upload.single('image'), imageController.uploadImage); 
    
router.use(upload.none()); // 이미지 외 작업의 경우에 적용

router.get('/', postController.paginatedPosts); // 게시글 목록 페이지 렌더링

router.route('/new') // 게시글 작성 요청 라우터
    .get((req: Request, res: Response) => {res.render('newPost');})
    .post(imageController.saveImage, postController.newpost);

router.route('/:postId') // 게시글 세부 페이지 렌더링 및 게시글 삭제 요청 라우터
    .get(postController.postdetail)
    .delete(postController.deletepost);

router.route('/:postId/update') // 게시글 수정 라우터
    .get(postController.renderUpdate)
    .put(postController.updatepost);

router.route('/:postId/like') // 좋아요 기능 라우터
    .post(postController.like)
    .delete(postController.unlike)

router.post('/:postId/comment', postController.comment); // 댓글 생성 라우터
router.delete('/:postId/comment/:commentId', postController.deletecomment); // 댓글 삭제 라우터

router.get('/notifications/stream', postController.sse); // 실시간 알림

export default router;

/**
 * 
 * 
 * 
 * 
 */