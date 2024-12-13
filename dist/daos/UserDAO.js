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
class UserDAO {
    constructor(connection) {
        QueryExecutor_1.default.initialize(connection);
    }
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT * FROM users 
        WHERE username = ?`;
            const { rows } = yield QueryExecutor_1.default.executeQuery(query, [username]);
            return rows[0] || null;
        });
    }
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO users (username, password) 
        VALUES (?, ?)`;
            yield QueryExecutor_1.default.executeQuery(query, [newUser.username, newUser.password]);
        });
    }
    removeUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        DELETE FROM users 
        WHERE id = ?`;
            yield QueryExecutor_1.default.executeQuery(query, [user_id]);
        });
    }
    editUser(curUserId, editUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        UPDATE users 
        SET username = ?, password = ? 
        WHERE id = ?`;
            yield QueryExecutor_1.default.executeQuery(query, [editUser.username, editUser.password, curUserId]);
        });
    }
}
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
