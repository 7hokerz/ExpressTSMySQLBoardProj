"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _userController_authMiddleware;
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
const shared_modules_2 = require("../utils/shared-modules");
const userService_1 = __importDefault(require("../services/userService"));
const tokenService_1 = __importDefault(require("../services/tokenService"));
class userController {
    constructor() {
        _userController_authMiddleware.set(this, void 0);
        __classPrivateFieldSet(this, _userController_authMiddleware, new shared_modules_1.AuthMiddleware(), "f");
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                yield userService_1.default.signup(username, password);
                res.redirect('/');
            }
            catch (error) {
                next(error);
            }
        });
    }
    withdraw(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.username && req.user_id) {
                yield userService_1.default.withdraw(req.user_id);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2);
            }
            res.redirect('/');
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user_id = yield userService_1.default.login(username, password);
                const Token = yield tokenService_1.default.generateToken(user_id, username, true);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY, Token.accessToken);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2, Token.refreshToken);
                res.redirect('/posts');
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.username && req.user_id) {
                    yield userService_1.default.logout(req.user_id);
                    this.CookieHandler(req, res, process.env.USER_COOKIE_KEY);
                    this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2);
                }
                res.redirect('/');
            }
            catch (error) {
                next(error);
            }
        });
    }
    renderUserInfoPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService_1.default.renderUserPage(req.username);
                res.render('userInfo', { user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    renderEditPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService_1.default.renderUserPage(req.username);
                res.render('editPage', { username: user.username });
            }
            catch (error) {
                next(error);
            }
        });
    }
    edit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = req.body;
                if (!__classPrivateFieldGet(this, _userController_authMiddleware, "f").regCheck(newUser.username, newUser.password)) { // 유효성 검증
                    throw new shared_modules_1.HttpError(400, `올바르지 않은 입력입니다.`);
                }
                const token = yield userService_1.default.edit(req.username, newUser);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY, token.accessToken);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2, token.refreshToken);
                res.redirect('/posts');
            }
            catch (error) {
                next(error);
            }
        });
    }
    CookieHandler(req, res, key, token, options) {
        if (req.cookies[key]) {
            res.clearCookie(key);
        } // 옵션 추가도 가능하도록 설계
        if (token) {
            res.cookie(key, token, Object.assign({ httpOnly: true, expires: new Date(Date.now() + 3600000), sameSite: 'lax' }, options));
        }
    }
}
_userController_authMiddleware = new WeakMap();
__decorate([
    shared_modules_2.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], userController.prototype, "withdraw", null);
__decorate([
    shared_modules_2.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], userController.prototype, "login", null);
__decorate([
    shared_modules_2.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], userController.prototype, "logout", null);
__decorate([
    shared_modules_2.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], userController.prototype, "edit", null);
exports.default = new userController();
