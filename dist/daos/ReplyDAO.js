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
class CommentDAO {
    constructor(connection) {
        QueryExecutor_1.default.initialize(connection);
    }
    getComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT user_id FROM comments
        WHERE comment_id = ?`;
            const { rows } = yield QueryExecutor_1.default.executeQuery(query, [commentId]);
            return rows[0] || null;
        });
    }
    createComment(postId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO comments (post_id, user_id, content) 
        VALUES (?, ?, ?)`;
            yield QueryExecutor_1.default.executeQuery(query, [postId, userId, content]);
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM comments 
        WHERE comment_id = ?`;
            yield QueryExecutor_1.default.executeQuery(query, [commentId]);
        });
    }
    deleteCommentAll(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM comments 
        WHERE post_id = ?`;
            yield QueryExecutor_1.default.executeQuery(query, [postId]);
        });
    }
}
exports.default = CommentDAO;
