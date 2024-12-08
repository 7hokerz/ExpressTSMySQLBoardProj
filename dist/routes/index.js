"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postRoutes_1 = __importDefault(require("./postRoutes"));
const loginRoutes_1 = __importDefault(require("./loginRoutes"));
const userInfo_1 = __importDefault(require("./userInfo"));
exports.default = {
    posts: postRoutes_1.default,
    login: loginRoutes_1.default,
    userInfo: userInfo_1.default,
};
