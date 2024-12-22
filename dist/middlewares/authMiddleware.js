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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const tsyringe_1 = require("tsyringe");
const utils_1 = require("../utils/");
const decorators_1 = require("../decorators");
const config_1 = __importDefault(require("../config"));
const errors_1 = require("../errors");
let AuthMiddleware = class AuthMiddleware {
    constructor(tokenUtil) {
        this.tokenUtil = tokenUtil;
        this.userCookieKey = config_1.default.cookie.user;
        this.userCookieKey2 = config_1.default.cookie.user2;
        this.CACHE_DURATION = 15 * 60; // 15분
        this.memoryCache = new node_cache_1.default({
            stdTTL: this.CACHE_DURATION, // 캐시 항목 기본 만료 시간
            checkperiod: this.CACHE_DURATION + 10, // 캐시 만료 검사 주기
        });
    }
    requireAuth(req, res, next) {
        if (!req.username || !req.user_id) {
            throw new errors_1.UnauthorizedError();
        }
        next();
    }
    cookieAuth(req, res, next) {
        if (req.path === '/refresh-token')
            return next();
        const token = req.cookies[this.userCookieKey];
        if (!token)
            return next();
        const cacheUser = this.memoryCache.get(token); // 캐시 조회
        if (cacheUser) {
            const userInfo = cacheUser;
            req.username = userInfo.username;
            req.user_id = userInfo.id;
            return next();
        }
        try {
            const payload = this.tokenUtil.verifyAccessToken(token);
            if (payload && payload.username) {
                this.memoryCache.set(token, {
                    username: payload.username,
                    id: payload.id
                });
                req.username = payload.username;
                req.user_id = payload.id;
            }
        }
        catch (error) {
            if (req.cookies[this.userCookieKey2]) {
                res.redirect('/refresh-token?nextlink=' + req.path);
                return;
            }
            throw new errors_1.UnauthorizedError();
        }
        next();
    }
};
AuthMiddleware = __decorate([
    (0, tsyringe_1.injectable)(),
    decorators_1.autoBind,
    __param(0, (0, tsyringe_1.inject)(utils_1.TokenUtil)),
    __metadata("design:paramtypes", [utils_1.TokenUtil])
], AuthMiddleware);
exports.default = AuthMiddleware;
/**
 * 쿠키로부터 토큰을 획득하여,
 * 토큰을 검증하고 원본을 변환한다.
 * 이때 토큰이 만료된 경우 쿠키에 저장된 리프레시 토큰을 검증한다.
 *
 *
 */ 
