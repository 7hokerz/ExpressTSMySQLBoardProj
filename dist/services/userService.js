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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const tsyringe_1 = require("tsyringe");
const utils_1 = require("../utils");
const decorators_1 = require("../decorators");
const errors_1 = require("../errors");
const entities_1 = require("../domain/entities");
const daos_1 = require("../daos");
class PasswordManager {
    static hashing(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hash(password, this.SALT_ROUNDS);
        });
    }
    static comparePwd(input_Pw, DB_Pw) {
        return __awaiter(this, void 0, void 0, function* () {
            const pwdState = yield bcrypt_1.default.compare(input_Pw, DB_Pw);
            if (!pwdState) { // 패스워드 일치 검증
                throw new errors_1.BadRequestError('패스워드 불일치');
            }
        });
    }
}
PasswordManager.SALT_ROUNDS = 10; // 10개의 해시를 생성, 약 100ms
let UserService = class UserService {
    constructor(jwttoken) {
        this.jwttoken = jwttoken;
    }
    signup(userReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daofactory.getDAO(daos_1.UserDAO);
            const { username } = userReq;
            const user = yield userDAO.getUser(username);
            if (user) {
                throw new errors_1.BadRequestError(`duplicate username: ${username}`);
            }
            const hashedPwd = yield PasswordManager.hashing(userReq.getPwd());
            yield userDAO.createUser({ username, password: hashedPwd });
        });
    }
    withdraw(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [userDAO, refreshTokenDAO] = yield Promise.all([
                this.daofactory.getDAO(daos_1.UserDAO),
                this.daofactory.getDAO(daos_1.RefreshTokenDAO),
            ]);
            yield Promise.all([
                refreshTokenDAO.deleteAllByUser(userId),
                userDAO.removeUser(userId)
            ]);
        });
    }
    login(userReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const [userDAO, refreshTokenDAO] = yield Promise.all([
                this.daofactory.getDAO(daos_1.UserDAO),
                this.daofactory.getDAO(daos_1.RefreshTokenDAO),
            ]);
            const { username } = userReq;
            const user = yield userDAO.getUser(username);
            if (!user) {
                throw new errors_1.BadRequestError(`존재하지 않는 이름: ${username}`);
            }
            yield PasswordManager.comparePwd(userReq.getPwd(), user.password);
            yield refreshTokenDAO.deleteAllByUser(user.id);
            return new entities_1.UserResponseDto(user.id);
        });
    }
    logout(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDAO = this.daofactory.getDAO(daos_1.RefreshTokenDAO);
            yield refreshTokenDAO.deleteAllByUser(user_id);
        });
    }
    edit(currentUserReq, newUserReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daofactory.getDAO(daos_1.UserDAO);
            const user = yield userDAO.getUser(newUserReq.username);
            if (newUserReq.username !== currentUserReq.username && user) { // 작성자 검증
                throw new errors_1.BadRequestError(`duplicate username: ${newUserReq.username}`);
            }
            const currentUser = yield userDAO.getUser(currentUserReq.username);
            if (!(currentUser.id)) { // 회원 유무 검증
                throw new errors_1.BadRequestError(`존재하지 않는 유저: ${currentUserReq.username}`);
            }
            yield PasswordManager.comparePwd(currentUserReq.getPwd(), currentUser.password);
            const hashedPwd = yield PasswordManager.hashing(newUserReq.getPwd());
            yield userDAO.editUser(currentUser.id, Object.assign(Object.assign({}, newUserReq), { password: hashedPwd }));
            const [accessToken, refreshToken] = yield Promise.all([
                this.jwttoken.generateAccessToken(newUserReq.username, currentUser.id),
                this.jwttoken.generateRefreshToken(newUserReq.username, currentUser.id),
            ]);
            return { accessToken, refreshToken };
        });
    }
    renderUserPage(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daofactory.getDAO(daos_1.UserDAO);
            const user = yield userDAO.getUser(username);
            if (!user) {
                throw new errors_1.BadRequestError(`존재하지 않는 유저: ${username}`);
            }
            return new entities_1.UserResponseDto(user.user_id, user.username);
        });
    }
};
__decorate([
    decorators_1.Transaction,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "withdraw", null);
UserService = __decorate([
    (0, tsyringe_1.injectable)(),
    decorators_1.withDB,
    __param(0, (0, tsyringe_1.inject)(utils_1.TokenUtil)),
    __metadata("design:paramtypes", [utils_1.TokenUtil])
], UserService);
exports.default = UserService;
