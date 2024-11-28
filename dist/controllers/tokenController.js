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
const tokenService_1 = __importDefault(require("../services/tokenService"));
const shared_modules_1 = require("../utils/shared-modules");
class tokenController {
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies[process.env.USER_COOKIE_KEY2];
            try {
                const { userId, username } = yield tokenService_1.default.verifyToken(refreshToken);
                const { accessToken } = yield tokenService_1.default.generateToken(userId, username, false);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY, accessToken);
                this.CookieHandler(req, res, process.env.USER_COOKIE_KEY2, refreshToken);
                res.redirect('/posts');
            }
            catch (error) {
                next(error);
            }
        });
    }
    CookieHandler(req, res, key, token, options) {
        if (req.cookies[key]) {
            res.clearCookie(key);
        } // 옵션 추가도 가능하도록 설계
        if (token) {
            res.cookie(key, token, Object.assign({ httpOnly: true, expires: new Date(Date.now() + 3600000), sameSite: 'lax' }, options));
        }
    }
}
__decorate([
    shared_modules_1.autoBind // 리프레시 토큰을 
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], tokenController.prototype, "refreshToken", null);
exports.default = new tokenController();
