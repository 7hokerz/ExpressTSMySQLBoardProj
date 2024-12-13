"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const controllers_2 = require("../controllers");
const shared_modules_1 = require("../utils/shared-modules");
const router = express_1.default.Router();
const auth = new shared_modules_1.AuthMiddleware();
const userController = new controllers_1.UserController();
const tokenController = new controllers_2.TokenController();
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
