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
const shared_modules_1 = require("../utils/shared-modules");
const tsyringe_1 = require("tsyringe");
const QueryService_1 = require("../services/QueryService");
let CommentDAO = class CommentDAO {
    constructor(connection, queryService = new QueryService_1.QueryService(connection)) {
        this.queryService = queryService;
    }
    getComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT user_id FROM comments
        WHERE comment_id = ?`;
            const { rows } = yield this.queryService.executeQuery(query, [commentId]);
            const pubId = rows[0];
            if (pubId === null || pubId === undefined)
                return null;
            return new shared_modules_1.UserDTO(pubId.user_id);
        });
    }
    createComment(postId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO comments (post_id, user_id, content) 
        VALUES (?, ?, ?)`;
            yield this.queryService.executeQuery(query, [postId, userId, content]);
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM comments 
        WHERE comment_id = ?`;
            yield this.queryService.executeQuery(query, [commentId]);
        });
    }
    deleteCommentAll(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM comments 
        WHERE post_id = ?`;
            yield this.queryService.executeQuery(query, [postId]);
        });
    }
};
CommentDAO = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)(QueryService_1.QueryService)),
    __metadata("design:paramtypes", [Object, QueryService_1.QueryService])
], CommentDAO);
exports.default = CommentDAO;
