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
var _tokenService_daofactory;
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
class tokenService {
    constructor() {
        _tokenService_daofactory.set(this, void 0);
        this.jwttoken = new shared_modules_1.jwtToken();
        __classPrivateFieldSet(this, _tokenService_daofactory, shared_modules_1.DAOFactory.getInstance(), "f");
    }
    // 리프레시, 액세스 토큰 생성
    generateToken(userId, username, stat) {
        var arguments_1 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_1[arguments_1.length - 1];
            const refreshTokenDAO = __classPrivateFieldGet(this, _tokenService_daofactory, "f").createRefreshTokenDAO(connection);
            const token = Object.assign({ accessToken: this.jwttoken.generateAccessToken(username, userId) }, (stat ? {
                refreshToken: this.jwttoken.generateRefreshToken(username, userId)
            } : {}));
            // 만료 시간 설정 (7일)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            if (stat && token.refreshToken) {
                yield refreshTokenDAO.create(userId, token.refreshToken, expiresAt);
            }
            return token;
        });
    }
    // 리프레시 토큰 검증
    verifyToken(token) {
        var arguments_2 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_2[arguments_2.length - 1];
            const refreshTokenDAO = __classPrivateFieldGet(this, _tokenService_daofactory, "f").createRefreshTokenDAO(connection);
            const storedToken = yield refreshTokenDAO.getRefreshToken(token);
            if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
                throw new Error('Refresh token is invalid or expired');
            }
            const payload = this.jwttoken.verifyRefreshToken(token);
            return { userId: payload.id, username: payload.username };
        });
    }
}
_tokenService_daofactory = new WeakMap();
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Boolean]),
    __metadata("design:returntype", Promise)
], tokenService.prototype, "generateToken", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], tokenService.prototype, "verifyToken", null);
exports.default = new tokenService();
