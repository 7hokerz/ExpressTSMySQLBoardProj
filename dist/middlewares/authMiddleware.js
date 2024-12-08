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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const shared_modules_1 = require("../utils/shared-modules");
class AuthMiddleware {
    constructor() {
        this.jwtService = new shared_modules_1.jwtToken();
        this.userCookieKey = process.env.USER_COOKIE_KEY;
        this.userCookieKey2 = process.env.USER_COOKIE_KEY2;
        this.CACHE_DURATION = 15 * 60; // 15분
        this.memoryCache = new node_cache_1.default({
            stdTTL: this.CACHE_DURATION, // 캐시 항목 기본 만료 시간
            checkperiod: this.CACHE_DURATION + 10, // 캐시 만료 검사 주기
        });
    }
    requireAuth(req, res, next) {
        if (!req.username) {
            res.status(401).send(`
                <h1>You are not Logged In</h1>
                <a href="/">Go Back</a>
            `);
            return;
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
            const payload = this.jwtService.verifyAccessToken(token);
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
        }
        next();
    }
}
exports.default = AuthMiddleware;
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], AuthMiddleware.prototype, "cookieAuth", null);
/*
    쿠키로부터 토큰을 획득하여,
    토큰을 검증하고 원본을 변환한다.
    이때 토큰이 만료된 경우 쿠키에 저장된 리프레시 토큰을 검증한다.
    리프레시 토큰이 존재하면 이를 이용하여 액세스 토큰을 재발급 받는다.

    

*/ 
