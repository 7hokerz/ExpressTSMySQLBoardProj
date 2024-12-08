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
const HttpError_1 = __importDefault(require("../errors/HttpError"));
const TransactionError_1 = __importDefault(require("../errors/TransactionError"));
const mysql_1 = __importDefault(require("../config/mysql"));
function withConnection(manageTransaction = false) {
    return function (_, _2, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const db = tsyringe_1.container.resolve(mysql_1.default);
                const connection = yield db.getConnection();
                if (!connection)
                    throw new HttpError_1.default(500, "데이터베이스 연결 실패");
                try {
                    this.daofactory = daos_1.DAOFactory.getInstance(connection);
                    if (manageTransaction)
                        yield connection.beginTransaction();
                    const result = yield originalMethod.apply(this, [...args]);
                    if (manageTransaction)
                        yield connection.commit();
                    return result;
                }
                catch (error) {
                    if (manageTransaction && !(error instanceof HttpError_1.default)) {
                        yield connection.rollback();
                        throw new TransactionError_1.default('트랜잭션 처리 중 오류.', error);
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
/*
    DB 연결에 관한 데코레이터
    
    DB 연결 및 해제를 자동화하고
    상황에 따라 트랜잭션도 자동화할 수 있다.

    커넥션을 데코레이터에서 생성하고 해제하므로
    역할 분리가 가능
*/ 
