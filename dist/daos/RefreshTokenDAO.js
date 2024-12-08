"use strict";
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
const QueryExecutor_1 = __importDefault(require("./QueryExecutor"));
class RefreshTokenDAO {
    constructor(connection) {
        QueryExecutor_1.default.initialize(connection);
    }
    // 리프레시 토큰 DB에 저장
    create(userId, token, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES (?, ?, ?)`;
            yield QueryExecutor_1.default.executeQuery(query, [userId, token, expiresAt]);
        });
    }
    // 리프레시 토큰 획득
    getRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`;
            const { rows } = yield QueryExecutor_1.default.executeQuery(query, [token]);
            return rows;
        });
    }
    // 특정 사용자의 토큰 모두 삭제
    deleteAllByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM refresh_tokens WHERE user_id = ?`;
            yield QueryExecutor_1.default.executeQuery(query, [userId]);
        });
    }
    // 특정 토큰 삭제
    deleteByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM refresh_tokens WHERE token = ?`;
            yield QueryExecutor_1.default.executeQuery(query, [token]);
        });
    }
}
exports.default = RefreshTokenDAO;
