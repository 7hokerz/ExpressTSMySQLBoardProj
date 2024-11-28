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
let LikeDAO = class LikeDAO {
    constructor(connection, queryService = new QueryService_1.QueryService(connection)) {
        this.queryService = queryService;
    }
    getLikeYN(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT 1 FROM postLike
        WHERE user_id = ? AND post_id = ?`;
            const { rows } = yield this.queryService.executeQuery(query, [userId, postId]);
            return rows.length > 0 ? "deleteLike" : "like";
        });
    }
    updateLike(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO postLike
        (user_id, post_id) VALUES (?, ?)`;
            const { header } = yield this.queryService.executeQuery(query, [userId, postId]);
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
            const { header } = yield this.queryService.executeQuery(query, [userId, postId]);
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
            const { header } = yield this.queryService.executeQuery(query, [postId]);
            //if (header.affectedRows === 0) {
            //throw new Error(`Post with ID ${postId} not found`);
            //}
        });
    }
};
LikeDAO = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)(QueryService_1.QueryService)),
    __metadata("design:paramtypes", [Object, QueryService_1.QueryService])
], LikeDAO);
exports.default = LikeDAO;
/*
    LikeDAO.js의 주요 기능 설명
    -

    LikeDAO.js 주요 편집 내용
    - getLikeYN에서 쿼리문을 SELECT 1 로 수정하여 효율성 개선

    추후 수정 및 추가할 내용?
    -
*/ 
