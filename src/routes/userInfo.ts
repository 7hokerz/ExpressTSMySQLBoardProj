import express from 'express';
import { UserController } from '../controllers';
import { container } from 'tsyringe';

const router = express.Router();

const userController = container.resolve(UserController);

// 회원정보 페이지 
router.get('/', userController.renderUserInfoPage);

router.route('/edit') // 회원정보 수정 라우터
    .get(userController.renderEditPage)
    .put(userController.edit);

export default router;

/**
 * 
 * 
 * 
 * 
 */