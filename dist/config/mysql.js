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
var _Database_pool, _Database_activeConnections;
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
class Database {
    constructor() {
        _Database_pool.set(this, void 0);
        _Database_activeConnections.set(this, new Set()); // 커넥션들을 담는 Set
        __classPrivateFieldSet(this, _Database_pool, promise_1.default.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_UID,
            password: process.env.DB_PWD,
            database: process.env.DB_DATABASE,
            connectionLimit: 5,
            enableKeepAlive: true, // Keep-Alive 활성화
            keepAliveInitialDelay: 10000, // Keep-Alive 초기 지연 (ms 단위)
        }), "f");
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield __classPrivateFieldGet(this, _Database_pool, "f").getConnection();
                __classPrivateFieldGet(this, _Database_activeConnections, "f").add(conn);
                return conn;
            }
            catch (error) {
                console.error("MySQL connection error: " + error);
                return null;
            }
        });
    }
    release(conn) {
        try {
            conn.release();
            __classPrivateFieldGet(this, _Database_activeConnections, "f").delete(conn);
        }
        catch (error) {
            console.error("MySQL release error: " + error);
        }
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeConnections = yield this.fetchActiveConnections();
                for (const conn of activeConnections)
                    this.release(conn);
                yield __classPrivateFieldGet(this, _Database_pool, "f").end();
            }
            catch (error) {
                console.error("MySQL end error: " + error);
            }
        });
    }
    // 연결된 모든 커넥션들을 반환
    fetchActiveConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(__classPrivateFieldGet(this, _Database_activeConnections, "f"));
        });
    }
}
_Database_pool = new WeakMap(), _Database_activeConnections = new WeakMap();
const db = Database.getInstance();
exports.default = db;
/*
  DB 연결 및 종료 함수를 모듈 형식으로 반환

  mysql2/promise: DB를 활용할 때 async/await의 비동기 방식으로 작성 가능

  getConnection()로 연결 설정 후 연결을 반환해야 함.
  그렇지 않으면 점유한 상태로 존재하게 됨.
*/ 
