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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
const services_1 = require("../services");
const index_1 = __importDefault(require("../config/index"));
class UserController {
    constructor() {
        this.userService = new services_1.UserService();
        this.tokenService = new services_1.TokenService();
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                yield this.userService.signup(username, password);
                res.redirect('/login');
            }
            catch (error) {
                next(error);
            }
        });
    }
    withdraw(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.username && req.user_id) {
                yield this.userService.withdraw(req.user_id);
                shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user);
                shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2);
            }
            res.status(200).json({
                ok: true,
            });
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const data = yield this.userService.login(username, atob(password));
                const Token = yield this.tokenService.generateToken(data.user_id, username, true);
                yield Promise.all([
                    shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user, Token.accessToken),
                    shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2, Token.refreshToken),
                ]);
                res.status(200).json({
                    ok: true
                });
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
                    yield this.userService.logout(req.user_id);
                    yield Promise.all([
                        shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user),
                        shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2),
                    ]);
                    res.status(200).json({
                        ok: true,
                    });
                }
                else {
                    res.status(200).json({
                        ok: false,
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    renderUserInfoPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.renderUserPage(req.username);
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
                const user = yield this.userService.renderUserPage(req.username);
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
                const token = yield this.userService.edit(req.username, newUser);
                yield Promise.all([
                    shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user, token.accessToken),
                    shared_modules_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2, token.refreshToken)
                ]);
                res.redirect('/posts');
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "withdraw", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "renderUserInfoPage", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "renderEditPage", null);
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "edit", null);
