"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _userService_daofactory;
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
/*
    입력값에 대한 기본 검증은 연결을 하지 않고도 할 수 있도록 변경 필요
*/
class PasswordManager {
    static hashing(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const bcrypt = yield Promise.resolve().then(() => __importStar(require('bcrypt'))); // 해싱
            return bcrypt.hash(password, this.SALT_ROUNDS);
        });
    }
    static comparePwd(input_Pw, DB_Pw) {
        return __awaiter(this, void 0, void 0, function* () {
            const bcrypt = yield Promise.resolve().then(() => __importStar(require('bcrypt'))); // 해싱
            return bcrypt.compare(input_Pw, DB_Pw);
        });
    }
}
PasswordManager.SALT_ROUNDS = 10;
class userService {
    constructor() {
        _userService_daofactory.set(this, void 0);
        this.jwttoken = new shared_modules_1.jwtToken();
        this.auth = new shared_modules_1.AuthMiddleware();
        __classPrivateFieldSet(this, _userService_daofactory, shared_modules_1.DAOFactory.getInstance(), "f");
    }
    signup(username, password) {
        var arguments_1 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_1[arguments_1.length - 1];
            if (!this.auth.regCheck(username, password)) {
                throw new shared_modules_1.HttpError(400, `올바르지 않은 입력입니다.`);
            }
            const userDAO = __classPrivateFieldGet(this, _userService_daofactory, "f").createUserDAO(connection);
            const user = yield userDAO.getUser(username);
            if (user) {
                throw new shared_modules_1.HttpError(400, `duplicate username: ${username}`);
            }
            const hashedPwd = yield PasswordManager.hashing(password);
            yield userDAO.createUser({ username, password: hashedPwd });
        });
    }
    withdraw(user_id) {
        var arguments_2 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_2[arguments_2.length - 1];
            const userDAO = __classPrivateFieldGet(this, _userService_daofactory, "f").createUserDAO(connection);
            const refreshTokenDAO = __classPrivateFieldGet(this, _userService_daofactory, "f").createRefreshTokenDAO(connection);
            yield refreshTokenDAO.deleteAllByUser(user_id);
            yield userDAO.removeUser(user_id);
        });
    }
    login(username, password) {
        var arguments_3 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_3[arguments_3.length - 1];
            const userDAO = __classPrivateFieldGet(this, _userService_daofactory, "f").createUserDAO(connection);
            const user = yield userDAO.getUser(username);
            if (!this.auth.regCheck(username, password)) {
                throw new shared_modules_1.HttpError(400, `올바르지 않은 입력입니다.`);
            }
            if (user === null || user === undefined) {
                throw new shared_modules_1.HttpError(400, `존재하지 않는 이름: ${username}`);
            }
            const pwdState = yield PasswordManager.comparePwd(password, user.getPwd());
            if (!pwdState) {
                throw new shared_modules_1.HttpError(400, `패스워드 불 일 치`);
            }
            return user.user_id;
        });
    }
    logout(user_id) {
        var arguments_4 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_4[arguments_4.length - 1];
            const refreshTokenDAO = __classPrivateFieldGet(this, _userService_daofactory, "f").createRefreshTokenDAO(connection);
            yield refreshTokenDAO.deleteAllByUser(user_id);
        });
    }
    renderUserPage(username) {
        var arguments_5 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_5[arguments_5.length - 1];
            const userDAO = __classPrivateFieldGet(this, _userService_daofactory, "f").createUserDAO(connection);
            const user = yield userDAO.getUser(username);
            if (user === null || user === undefined) {
                throw new shared_modules_1.HttpError(400, `존재하지 않는 유저: ${username}`);
            }
            return user;
        });
    }
    edit(curUsername, newUser) {
        var arguments_6 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = arguments_6[arguments_6.length - 1];
            const userDAO = __classPrivateFieldGet(this, _userService_daofactory, "f").createUserDAO(connection);
            const user = yield userDAO.getUser(newUser.username);
            if (newUser.username !== curUsername && user) { // 작성자 검증
                throw new shared_modules_1.HttpError(400, `duplicate username: ${newUser.username}`);
            }
            const curUser = yield userDAO.getUser(curUsername);
            if (!(curUser === null || curUser === void 0 ? void 0 : curUser.user_id)) { // 회원 유무 검증
                throw new shared_modules_1.HttpError(400, `올바르지 않은 유저: ${curUsername}`);
            }
            const pwdState = yield PasswordManager.comparePwd(newUser.curPw, curUser.getPwd());
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
_userService_daofactory = new WeakMap();
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], userService.prototype, "signup", null);
__decorate([
    (0, shared_modules_1.withConnection)(true, shared_modules_1.HttpError, shared_modules_1.TransactionError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], userService.prototype, "withdraw", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], userService.prototype, "login", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], userService.prototype, "logout", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], userService.prototype, "renderUserPage", null);
__decorate([
    (0, shared_modules_1.withConnection)(false, shared_modules_1.HttpError),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], userService.prototype, "edit", null);
exports.default = new userService();
