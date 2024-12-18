"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
const auth = tsyringe_1.container.resolve(middlewares_1.AuthMiddleware);
const userController = tsyringe_1.container.resolve(controllers_1.UserController);
const tokenController = tsyringe_1.container.resolve(controllers_1.TokenController);
router.route('/signup') //회원가입
    .get((req, res) => { res.render('signup'); })
    .post(userController.signup);
router.get('/withdraw', auth.requireAuth, userController.withdraw); //회원탈퇴
router.route('/login') //로그인
    .get((req, res) => {
    if (req.username)
        return res.redirect('/posts');
    res.render('login');
})
    .post(userController.login); // 로
router.get('/logout', auth.requireAuth, userController.logout);
router.get('/refresh-token', tokenController.refreshToken);
exports.default = router;
/**
 *
 *
 *
 *
 */ 
