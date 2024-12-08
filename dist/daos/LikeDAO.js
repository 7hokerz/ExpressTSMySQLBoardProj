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
class LikeDAO {
    constructor(connection) {
        QueryExecutor_1.default.initialize(connection);
    }
    getLikeYN(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT 1 FROM postLike
        WHERE user_id = ? AND post_id = ?`;
            const { rows } = yield QueryExecutor_1.default.executeQuery(query, [userId, postId]);
            return rows.length > 0 ? "deleteLike" : "like";
        });
    }
    updateLike(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO postLike
        (user_id, post_id) VALUES (?, ?)`;
            const { header } = yield QueryExecutor_1.default.executeQuery(query, [userId, postId]);
            if (header.affectedRows === 0) {
                throw new Error(`Post with ID ${postId} not found`);
            }
        });
    }
    deleteLike(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM postLike
        WHERE user_id = ? AND post_id = ?`;
            const { header } = yield QueryExecutor_1.default.executeQuery(query, [userId, postId]);
            if (header.affectedRows === 0) {
                throw new Error(`Post with ID ${postId} not found`);
            }
        });
    }
    deleteLikeAll(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM postLike 
        WHERE post_id = ?`;
            const { header } = yield QueryExecutor_1.default.executeQuery(query, [postId]);
            //if (header.affectedRows === 0) {
            //throw new Error(`Post with ID ${postId} not found`);
            //}
        });
    }
}
exports.default = LikeDAO;
/*
    LikeDAO.js의 주요 기능 설명
    -

    LikeDAO.js 주요 편집 내용
    - getLikeYN에서 쿼리문을 SELECT 1 로 수정하여 효율성 개선

    추후 수정 및 추가할 내용?
    -
*/ 
