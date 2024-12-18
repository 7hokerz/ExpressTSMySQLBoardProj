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
const promise_1 = __importDefault(require("mysql2/promise"));
const tsyringe_1 = require("tsyringe");
const index_1 = __importDefault(require("./index"));
let Database = class Database {
    constructor() {
        this.activeConnections = new Set(); // 커넥션들을 담는 Set
        this.pool = promise_1.default.createPool({
            host: index_1.default.db.host,
            port: parseInt(index_1.default.db.port, 10),
            user: index_1.default.db.uid,
            password: index_1.default.db.pwd,
            database: index_1.default.db.database,
            connectionLimit: 10,
            enableKeepAlive: true, // Keep-Alive 활성화
            keepAliveInitialDelay: 10000, // Keep-Alive 초기 지연 (ms 단위)
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield this.pool.getConnection();
                this.activeConnections.add(conn);
                return conn;
            }
            catch (error) {
                console.error("MySQL connection error: " + error);
                throw new Error;
            }
        });
    }
    release(conn) {
        try {
            conn.release();
            this.activeConnections.delete(conn);
        }
        catch (error) {
            console.error("Failed to release connection:", error);
        }
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeConnections = yield this.fetchActiveConnections();
                for (const conn of activeConnections) {
                    console.log(conn);
                    this.release(conn);
                }
                yield this.pool.end();
            }
            catch (error) {
                console.error("Failed to close the pool:", error);
            }
        });
    }
    // 연결된 모든 커넥션들을 반환
    fetchActiveConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(this.activeConnections);
        });
    }
};
Database = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], Database);
exports.default = Database;
/*
  DB 연결 및 종료 함수를 모듈 형식으로 반환

  mysql2/promise: DB를 활용할 때 async/await의 비동기 방식으로 작성 가능

  getConnection()로 연결 설정 후 연결을 반환해야 함.
  그렇지 않으면 점유한 상태로 존재하게 됨.
*/ 
