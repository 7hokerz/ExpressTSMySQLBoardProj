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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _userController_authMiddleware;
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
const userService_1 = __importDefault(require("../services/userService"));
class userController {
    constructor() {
        _userController_authMiddleware.set(this, void 0);
        __classPrivateFieldSet(this, _userController_authMiddleware, new shared_modules_1.AuthMiddleware(), "f");
    }
    signup() {
        return {
            execute: (req) => __awaiter(this, void 0, void 0, function* () {
                const { username, password } = req.body;
                yield userService_1.default.signup(username, password);
                return {
                    success: true,
                    data: {
                        redirect: '/'
                    },
                    status: 200
                };
            })
        };
    }
    withdraw() {
        return {
            execute: (req, res) => __awaiter(this, void 0, void 0, function* () {
                if (req.username) {
                    yield userService_1.default.withdraw(req.username);
                    this.clearUserCookie(res);
                }
                return {
                    success: true,
                    data: {
                        redirect: '/'
                    },
                    status: 200
                };
            })
        };
    }
    login() {
        return {
            execute: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { username, password } = req.body;
                const token = yield userService_1.default.login(username, password);
                this.setUserCookie(res, token);
                return {
                    success: true,
                    data: {
                        redirect: '/posts'
                    },
                    status: 200
                };
            })
        };
    }
    edit() {
        return {
            execute: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const newUser = req.body;
                if (!__classPrivateFieldGet(this, _userController_authMiddleware, "f").regCheck(newUser.username, newUser.password)) { // 유효성 검증
                    throw new shared_modules_1.HttpError(400, `올바르지 않은 입력입니다.`);
                }
                const token = yield userService_1.default.edit(req.username, newUser);
                this.clearUserCookie(res);
                this.setUserCookie(res, token);
                return {
                    success: true,
                    data: {
                        redirect: '/posts'
                    },
                    status: 200
                };
            })
        };
    }
    setUserCookie(res, token) {
        res.cookie(process.env.USER_COOKIE_KEY, token, { httpOnly: true });
    }
    clearUserCookie(res) {
        res.clearCookie(process.env.USER_COOKIE_KEY);
    }
}
_userController_authMiddleware = new WeakMap();
exports.default = new userController();
