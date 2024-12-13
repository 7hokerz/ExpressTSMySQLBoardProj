"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.TokenController = exports.PostController = void 0;
const postController_1 = __importDefault(require("./postController"));
exports.PostController = postController_1.default;
const tokenController_1 = __importDefault(require("./tokenController"));
exports.TokenController = tokenController_1.default;
const userController_1 = __importDefault(require("./userController"));
exports.UserController = userController_1.default;
