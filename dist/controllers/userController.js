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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const tsyringe_1 = require("tsyringe");
const decorators_1 = require("../decorators");
const utils_1 = require("../utils/");
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
const index_1 = __importDefault(require("../config/index"));
const errors_1 = require("../errors");
const class_validator_1 = require("class-validator");
const entities_1 = require("../domain/entities");
let UserController = class UserController {
    constructor(tokenService, userService) {
        this.tokenService = tokenService;
        this.userService = userService;
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const userReq = new entities_1.UserRequestDto(username, atob(password));
            yield (0, class_validator_1.validateOrReject)(userReq); // 조건 불만족 시 오류 반환
            yield this.userService.signup(userReq);
            res.status(200).json(middlewares_1.ResponseHandler.success(null));
        });
    }
    withdraw(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(req.username && req.user_id)) {
                throw new errors_1.UnauthorizedError();
            }
            yield this.userService.withdraw(req.user_id);
            yield Promise.all([
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user),
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2),
            ]);
            res.status(200).json(middlewares_1.ResponseHandler.success(null));
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const userReq = new entities_1.UserRequestDto(username, atob(password));
            yield (0, class_validator_1.validateOrReject)(userReq); // 조건 불만족 시 오류 반환
            const data = yield this.userService.login(userReq);
            const Token = yield this.tokenService.generateToken(data.user_id, username, true);
            yield Promise.all([
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user, Token.accessToken),
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2, Token.refreshToken),
            ]);
            res.status(200).json(middlewares_1.ResponseHandler.success(null));
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(req.username && req.user_id)) {
                throw new errors_1.UnauthorizedError();
            }
            yield this.userService.logout(req.user_id);
            yield Promise.all([
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user),
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2),
            ]);
            res.status(200).json(middlewares_1.ResponseHandler.success(null));
        });
    }
    edit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.username) {
                throw new errors_1.UnauthorizedError();
            }
            const { username, curPw, password } = req.body;
            const newUserReq = new entities_1.UserRequestDto(username, password);
            const currentUserReq = new entities_1.UserRequestDto(req.username, curPw);
            yield (0, class_validator_1.validateOrReject)(newUserReq); // 조건 불만족 시 오류 반환
            yield (0, class_validator_1.validateOrReject)(currentUserReq);
            const token = yield this.userService.edit(currentUserReq, newUserReq);
            yield Promise.all([
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user, token.accessToken),
                utils_1.CookieUtil.manageCookie(req, res, index_1.default.cookie.user2, token.refreshToken)
            ]);
            res.redirect('/posts');
        });
    }
    renderUserInfoPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.username) {
                throw new errors_1.UnauthorizedError();
            }
            const user = yield this.userService.renderUserPage(req.username);
            res.render('userInfo', { user });
        });
    }
    renderEditPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.username) {
                throw new errors_1.UnauthorizedError();
            }
            const user = yield this.userService.renderUserPage(req.username);
            res.render('editPage', { username: user.username });
        });
    }
};
UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    decorators_1.autoBind,
    decorators_1.AsyncWrapper,
    __param(0, (0, tsyringe_1.inject)(services_1.TokenService)),
    __param(1, (0, tsyringe_1.inject)(services_1.UserService)),
    __metadata("design:paramtypes", [services_1.TokenService,
        services_1.UserService])
], UserController);
exports.default = UserController;
