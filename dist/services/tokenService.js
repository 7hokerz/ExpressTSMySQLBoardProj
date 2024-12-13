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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/");
const decorators_1 = require("../decorators");
const daos_1 = require("../daos");
const tsyringe_1 = require("tsyringe");
let TokenService = class TokenService {
    constructor(jwttoken = new utils_1.TokenUtil()) {
        this.jwttoken = jwttoken;
    }
    // 리프레시, 액세스 토큰 생성
    generateToken(userId, username, stat) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDAO = this.daofactory.getDAO(daos_1.RefreshTokenDAO);
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
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDAO = this.daofactory.getDAO(daos_1.RefreshTokenDAO);
            const storedToken = yield refreshTokenDAO.getRefreshToken(token);
            if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
                throw new Error('만료되거나 유효하지 않은 토큰');
            }
            const payload = this.jwttoken.verifyRefreshToken(token);
            return { userId: payload.id, username: payload.username };
        });
    }
};
TokenService = __decorate([
    (0, tsyringe_1.injectable)(),
    decorators_1.withDB,
    __param(0, (0, tsyringe_1.inject)(utils_1.TokenUtil)),
    __metadata("design:paramtypes", [utils_1.TokenUtil])
], TokenService);
exports.default = TokenService;
