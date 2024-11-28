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
const tsyringe_1 = require("tsyringe");
const QueryService_1 = require("../services/QueryService");
let RefreshTokenDAO = class RefreshTokenDAO {
    constructor(connection, queryService = new QueryService_1.QueryService(connection)) {
        this.queryService = queryService;
    }
    // 리프레시 토큰 DB에 저장
    create(userId, token, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES (?, ?, ?)`;
            yield this.queryService.executeQuery(query, [userId, token, expiresAt]);
        });
    }
    // 리프레시 토큰 획득
    getRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`;
            const { rows } = yield this.queryService.executeQuery(query, [token]);
            return rows;
        });
    }
    // 특정 사용자의 토큰 모두 삭제
    deleteAllByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM refresh_tokens WHERE user_id = ?`;
            yield this.queryService.executeQuery(query, [userId]);
        });
    }
    // 특정 토큰 삭제
    deleteByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM refresh_tokens WHERE token = ?`;
            yield this.queryService.executeQuery(query, [token]);
        });
    }
};
RefreshTokenDAO = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)(QueryService_1.QueryService)),
    __metadata("design:paramtypes", [Object, QueryService_1.QueryService])
], RefreshTokenDAO);
exports.default = RefreshTokenDAO;
