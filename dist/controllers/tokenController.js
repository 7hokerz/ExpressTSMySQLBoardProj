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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const shared_modules_1 = require("../utils/shared-modules");
class TokenController {
    constructor() {
        this.tokenService = new services_1.TokenService();
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies[process.env.USER_COOKIE_KEY2];
            try {
                if (!refreshToken) {
                    res.status(401).send(`
                    <h1>You are not Logged In</h1>
                    <a href="/">Go Back</a>
                `);
                    return;
                }
                const { userId, username } = yield this.tokenService.verifyToken(refreshToken);
                const { accessToken } = yield this.tokenService.generateToken(userId, username, false);
                shared_modules_1.CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY, accessToken);
                shared_modules_1.CookieUtil.manageCookie(req, res, process.env.USER_COOKIE_KEY2, refreshToken);
                res.redirect(req.query.nextlink);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = TokenController;
__decorate([
    shared_modules_1.autoBind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "refreshToken", null);
