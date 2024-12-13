import express, { Request, Response } from 'express';
import { PostController } from '../controllers';
import uploadRouter from './imageRoutes';
import { imageCacheMiddleware } from '../middlewares/imageCacheMiddleware';

const router = express.Router();

const postController = new PostController();

router.use('/upload', uploadRouter); // 이미지 업로드에 대한 라우터

router.get('/', postController.posts); // 게시글 목록 페이지 렌더링

router.route('/new') // 게시글 작성 페이지 렌더링 및 게시글 작성 요청 라우터
    .get((req: Request, res: Response) => {res.render('newPost');})
    .post(postController.newpost);

router.route('/:postId') // 게시글 세부 페이지 렌더링 및 게시글 삭제 요청 라우터
    .get(/*imageCacheMiddleware,*/ postController.postdetail)
    .delete(postController.deletepost);

router.route('/:postId/update') // 게시글 수정 페이지 렌더링 및 게시글 수정 라우터
    .get(postController.renderUpdate)
    .put(postController.updatepost);

router.post('/:postId/like', postController.like); // 좋아요 기능 라우터

router.post('/:postId/deleteLike', postController.unlike); // 좋아요 취소 기능 라우터

router.post('/:postId/comment', postController.comment); // 댓글 생성 라우터

router.delete('/:postId/comment/:commentId', postController.deletecomment); // 댓글 삭제 라우터

router.get('/notifications/stream', postController.sse);

export default router;

/*
    posts.js의 주요 기능 설명
    - 게시글 목록 페이지: DB에서 내용을 불러와서 index.ejs에 내용을 렌더링
    - 게시글 작성 페이지: 작성 페이지를 렌더링
    - 게시글 세부 보기: DB에서 특정 ID의 내용을 불러와서 postDetails.ejs에 내용을 렌더링
    - 게시글 작성 요청 라우터: POST 요청을 받아 내용을 DB에 삽입한 후 루트 페이지로 리다이렉트
    - 게시글 삭제 라우터: DELETE 요청을 프론트단에서 받아 삭제 후 json 응답 전송
    - 

    posts.js 주요 편집 내용
    - 트랜잭션을 사용하여 게시글 삭제 시 좋아요, 댓글 삭제 작업을 추가하고
    데이터의 일관성을 보장
    >> 락 기능에 대해서도 고민

    추후 수정 및 추가할 내용?
    - 게시글 수정에 대한 날짜 등의 추가 기능 도입 필요
    

});
*/