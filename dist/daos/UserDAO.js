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
let UserDAO = class UserDAO {
    constructor(connection, queryService = new QueryService_1.QueryService(connection)) {
        this.queryService = queryService;
    }
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT * FROM users 
        WHERE username = ?`;
            const { rows } = yield this.queryService.executeQuery(query, [username]);
            const user = rows[0];
            if (user === null || user === undefined)
                return null;
            return new shared_modules_1.UserDTO(user.id, user.username, user.password);
        });
    }
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO users (username, password) 
        VALUES (?, ?)`;
            yield this.queryService.executeQuery(query, [newUser.username, newUser.password]);
        });
    }
    removeUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM users 
        WHERE id = ?`;
            yield this.queryService.executeQuery(query, [user_id]);
        });
    }
    editUser(curUserId, editUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        UPDATE users 
        SET username = ?, password = ? 
        WHERE id = ?`;
            yield this.queryService.executeQuery(query, [editUser.username, editUser.password, curUserId]);
        });
    }
};
UserDAO = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)(QueryService_1.QueryService)),
    __metadata("design:paramtypes", [Object, QueryService_1.QueryService])
], UserDAO);
exports.default = UserDAO;
/*
    UserDAO.js의 주요 기능 설명
    - getUser(): DB에서 사용자 정보를 가져오는 함수
    - createUser(): DB에 사용자 정보를 추가하는 함수
    - removeUser(): DB에 있는 사용자 정보를 지우는 함수
    - editUser(): DB에 있는 사용자 정보를 수정하는 함수

    UserDAO.js 주요 편집 내용
    -

    추후 수정 및 추가할 내용?
    - 현재 유저가 글이나 댓글이 존재하면 회원탈퇴가 불가능한데,
    (DB 제약 조건의 영향)
    이를 위해서는 글이나 댓글을 함께 삭제하거나
    아니면 회원만 탈퇴되고 글은 남아있거나 하면서
    (탈퇴한 회원)으로 표시되도록 하거나 등의 개선점이 필요
*/ 
