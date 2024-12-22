"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const tsyringe_1 = require("tsyringe");
const router = express_1.default.Router();
const userController = tsyringe_1.container.resolve(controllers_1.UserController);
// 회원정보 페이지 
router.get('/', userController.renderUserInfoPage);
router.route('/edit') // 회원정보 수정 라우터
    .get(userController.renderEditPage)
    .put(userController.edit);
exports.default = router;
/**
 *
 *
 *
 *
 */ 
