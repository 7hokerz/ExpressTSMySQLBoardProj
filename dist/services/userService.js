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
const shared_modules_1 = require("../utils/shared-modules");
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
            return bcrypt_1.default.compare(input_Pw, DB_Pw);
        });
    }
}
PasswordManager.SALT_ROUNDS = 10;
class UserService {
    constructor() {
        this.jwttoken = new shared_modules_1.jwtToken();
    }
    validateUserInput(input) {
        return __awaiter(this, void 0, void 0, function* () {
            shared_modules_1.Validation.validUserInput([
                { value: input.username },
                { value: input.password }
            ]);
        });
    }
    signup(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateUserInput({ username, password });
            const userDAO = this.daofactory.getDAO(daos_1.UserDAO);
            const user = yield userDAO.getUser(username);
            if (user) {
                throw new shared_modules_1.HttpError(400, `duplicate username: ${username}`);
            }
            const hashedPwd = yield PasswordManager.hashing(password);
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
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateUserInput({ username, password });
            const [userDAO, refreshTokenDAO] = yield Promise.all([
                this.daofactory.getDAO(daos_1.UserDAO),
                this.daofactory.getDAO(daos_1.RefreshTokenDAO),
            ]);
            const user = yield userDAO.getUser(username);
            if (!user) {
                throw new shared_modules_1.HttpError(400, `존재하지 않는 이름: ${username}`);
            }
            const pwdState = yield PasswordManager.comparePwd(password, user.password);
            if (!pwdState) {
                throw new shared_modules_1.HttpError(400, `패스워드 불 일 치`);
            }
            yield refreshTokenDAO.deleteAllByUser(user.id);
            return new entities_1.UserDTO(user.id);
        });
    }
    logout(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDAO = this.daofactory.getDAO(daos_1.RefreshTokenDAO);
            yield refreshTokenDAO.deleteAllByUser(user_id);
        });
    }
    renderUserPage(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daofactory.getDAO(daos_1.UserDAO);
            const user = yield userDAO.getUser(username);
            if (!user) {
                throw new shared_modules_1.HttpError(400, `존재하지 않는 유저: ${username}`);
            }
            return new entities_1.UserDTO(user.user_id, user.username, user.pwd);
        });
    }
    edit(curUsername, newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                shared_modules_1.Validation.validUserInput([{ value: newUser.username }]),
                shared_modules_1.Validation.validUserInput([{ value: newUser.password }])
            ]);
            const userDAO = this.daofactory.getDAO(daos_1.UserDAO);
            const user = yield userDAO.getUser(newUser.username);
            if (newUser.username !== curUsername && user) { // 작성자 검증
                throw new shared_modules_1.HttpError(400, `duplicate username: ${newUser.username}`);
            }
            const curUser = yield userDAO.getUser(curUsername);
            if (!(curUser === null || curUser === void 0 ? void 0 : curUser.user_id)) { // 회원 유무 검증
                throw new shared_modules_1.HttpError(400, `올바르지 않은 유저: ${curUsername}`);
            }
            const pwdState = yield PasswordManager.comparePwd(newUser.curPw, curUser.password);
            if (!pwdState) { // 패스워드 일치 검증
                throw new shared_modules_1.HttpError(400, '패스워드 불일치');
            }
            const hashedPwd = yield PasswordManager.hashing(newUser.password);
            yield userDAO.editUser(curUser.user_id, Object.assign(Object.assign({}, newUser), { password: hashedPwd }));
            const accessToken = this.jwttoken.generateAccessToken(newUser.username, curUser.user_id);
            const refreshToken = this.jwttoken.generateRefreshToken(newUser.username, curUser.user_id);
            return { accessToken, refreshToken };
        });
    }
}
exports.default = UserService;
__decorate([
    (0, shared_modules_1.withConnection)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "signup", null);
__decorate([
    (0, shared_modules_1.withConnection)(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "withdraw", null);
__decorate([
    (0, shared_modules_1.withConnection)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "login", null);
__decorate([
    (0, shared_modules_1.withConnection)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "logout", null);
__decorate([
    (0, shared_modules_1.withConnection)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "renderUserPage", null);
__decorate([
    (0, shared_modules_1.withConnection)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "edit", null);
