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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withConnection = withConnection;
const tsyringe_1 = require("tsyringe");
const daos_1 = require("../daos");
const errors_1 = require("../errors");
const mysql_1 = __importDefault(require("../config/mysql"));
function withConnection(Transaction = false) {
    return function (_, _2, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const db = tsyringe_1.container.resolve(mysql_1.default);
                const connection = yield db.getConnection();
                if (!connection)
                    throw new errors_1.HttpError(500, "데이터베이스 연결 실패");
                try {
                    this.daofactory = daos_1.DAOFactory.getInstance(connection);
                    if (Transaction)
                        yield connection.beginTransaction();
                    const result = yield originalMethod.apply(this, [...args]);
                    if (Transaction)
                        yield connection.commit();
                    return result;
                }
                catch (error) {
                    if (Transaction) {
                        yield connection.rollback();
                        throw new errors_1.HttpError(500, '트랜잭션 처리 중 오류.');
                    }
                    throw error;
                }
                finally {
                    db.release(connection); // 연결 해제
                }
            });
        };
        return descriptor;
    };
}
/**
 * DB의 커넥션 연결 및 해제 역할을 담당하는 데코레이터
 *
 * - DB 객체는 의존성 주입
 *
 * - DAOFactory 객체 주입 (개별 DAO는 서비스 레이어에서 생성)
 *
 * - 선택적인 트랜잭션 기능
 *
 *
 */ 
