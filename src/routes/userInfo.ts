import express from 'express';
import { UserController } from '../controllers';

const router = express.Router();

const userController = new UserController();

// 회원정보 페이지 렌더링
router.get('/', userController.renderUserInfoPage);

// 회원정보 수정 페이지 렌더링 및 수정 라우터
router.route('/edit')
    .get(userController.renderEditPage)
    .put(userController.edit);

export default router;

/**
 * 
 * 
 * 
 * 
 */