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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var _JwtToken_jwtSecret, _JwtToken_refreshSecret;
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
class JwtToken {
    constructor() {
        _JwtToken_jwtSecret.set(this, void 0);
        _JwtToken_refreshSecret.set(this, void 0);
        const secret = index_1.default.secret.secret;
        const refreshSecret = index_1.default.secret.refreshsecret;
        if (!secret || !refreshSecret) {
            throw new Error('JWT secret key is required');
        }
        __classPrivateFieldSet(this, _JwtToken_jwtSecret, secret, "f");
        __classPrivateFieldSet(this, _JwtToken_refreshSecret, refreshSecret, "f");
    }
    // username, user_id를 포함하는 jwt 생성
    generateAccessToken(username, id) {
        const payload = { username, id };
        return jsonwebtoken_1.default.sign(payload, __classPrivateFieldGet(this, _JwtToken_jwtSecret, "f"), { expiresIn: '1h' });
    }
    generateRefreshToken(username, id) {
        const payload = { username, id };
        return jsonwebtoken_1.default.sign(payload, __classPrivateFieldGet(this, _JwtToken_refreshSecret, "f"), { expiresIn: '7d' });
    }
    // 토큰에서 원래의 Payload 추출 및 검증 
    verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, __classPrivateFieldGet(this, _JwtToken_jwtSecret, "f"));
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                //console.error('Token expired:', error.message);
            }
            else if (error instanceof Error) {
                console.error('Token verification failed:', error.message);
                throw new Error('Invalid or expired token');
            }
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, __classPrivateFieldGet(this, _JwtToken_refreshSecret, "f"));
        }
        catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
}
_JwtToken_jwtSecret = new WeakMap(), _JwtToken_refreshSecret = new WeakMap();
exports.default = JwtToken;
/*
    TokenPayload 인터페이스
    - 토큰에 들어가는 데이터를 정의
        username(아이디), user_id(식별 번호)

    JwtToken 클래스
    - 생성자: .env에서 시크릿 키를 불러온 후 할당
    - generateToken
        데이터를 암호화하여 토큰을 반환
    - verifyToken
        토큰을 해독하여 무결성을 확인하고 원본을 반환
    

    추후 수정 및 추가할 내용?
    -
*/ 
