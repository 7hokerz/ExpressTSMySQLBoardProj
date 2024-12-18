import express from 'express';
import { UserController } from '../controllers';
import { container } from 'tsyringe';

const router = express.Router();

const userController = container.resolve(UserController);

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