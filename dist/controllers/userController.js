"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const utils_1 = require("../utils/");
const services_1 = require("../services");
const decorators_1 = require("../decorators");
const index_1 = __importDefault(require("../config/index"));
let UserController = class UserController {
    constructor() {
        this.userService = new services_1.UserService();
        this.tokenService = new services_1.TokenService();
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            yield this.userService.signup(username, password);
            res.redirect('/login');
        });
    }
    withdraw(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.username && req.user_id) {
                yield this.userService.withdraw(req.user_id);
                yield Promise.all([
                    utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user),
                    utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2),
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
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const data = yield this.userService.login(username, atob(password));
            const Token = yield this.tokenService.generateToken(data.user_id, username, true);
            yield Promise.all([
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user, Token.accessToken),
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2, Token.refreshToken),
            ]);
            res.status(200).json({
                ok: true
            });
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.username && req.user_id) {
                yield this.userService.logout(req.user_id);
                yield Promise.all([
                    utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user),
                    utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2),
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
        });
    }
    edit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = req.body;
            const token = yield this.userService.edit(req.username, newUser);
            yield Promise.all([
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user, token.accessToken),
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2, token.refreshToken)
            ]);
            res.redirect('/posts');
        });
    }
    renderUserInfoPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.renderUserPage(req.username);
            res.render('userInfo', { user });
        });
    }
    renderEditPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.renderUserPage(req.username);
            res.render('editPage', { username: user.username });
        });
    }
};
UserController = __decorate([
    decorators_1.autoBind,
    decorators_1.AsyncHandler
], UserController);
exports.default = UserController;
