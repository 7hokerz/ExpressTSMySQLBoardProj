"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv_1.default.config();
exports.default = {
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        uid: process.env.DB_UID,
        pwd: process.env.DB_PWD,
        database: process.env.DB_DATABASE,
    },
    secret: {
        secret: process.env.JWT_SECRET,
        refreshsecret: process.env.JWT_REFRESHSECRET,
    },
    cookie: {
        user: process.env.USER_COOKIE_KEY,
        user2: process.env.USER_COOKIE_KEY2,
    }
};
