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
var _AuthMiddleware_jwtService;
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
class AuthMiddleware {
    constructor() {
        _AuthMiddleware_jwtService.set(this, void 0);
        __classPrivateFieldSet(this, _AuthMiddleware_jwtService, new shared_modules_1.jwtToken(), "f");
        this.userCookieKey = process.env.USER_COOKIE_KEY;
        this.userCookieKey2 = process.env.USER_COOKIE_KEY2;
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
    regCheck(username, password) {
        const regex = /^[a-zA-Z0-9\s*!]+$/; //알파벳 및 공백, *, !만 허용
        return (regex.test(username) && regex.test(password));
    }
    cookieAuth(req, res, next) {
        if (req.path == '/refresh-token') {
            return next();
        }
        const token = req.cookies[this.userCookieKey];
        if (token) {
            const payload = __classPrivateFieldGet(this, _AuthMiddleware_jwtService, "f").verifyAccessToken(token);
            if (payload && payload.username !== null) {
                req.username = payload.username;
                req.user_id = payload.id;
            }
            else {
                const refreshtoken = req.cookies[this.userCookieKey2];
                if (refreshtoken) {
                    return res.redirect('/refresh-token');
                }
            }
        }
        next();
    }
}
_AuthMiddleware_jwtService = new WeakMap();
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
/*
    auth.js의 주요 기능 설명
    - requireAuth(): req.username 존재를 검증하는 접근 제어 미들웨어
    - regCheck(): 정규식을 이용하여 문자열 검증
    - cookieCheck(): 쿠키를 복호화
        쿠키를 검증하여 username, id를 req 객체에 담는다.

    auth.js 주요 편집 내용
    -

    추후 수정 및 추가할 내용?
    -

*/ 
