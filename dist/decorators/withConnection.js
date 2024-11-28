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
Object.defineProperty(exports, "__esModule", { value: true });
exports.withConnection = withConnection;
const shared_modules_1 = require("../utils/shared-modules");
// DB 커넥션 데코레이터
function withConnection(manageTransaction = false, HttpError, TransactionError) {
    return function (_, _2, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const connection = yield shared_modules_1.db.getConnection();
                if (!connection) {
                    throw new HttpError(500, "데이터베이스 연결 실패");
                }
                try {
                    if (manageTransaction)
                        yield connection.beginTransaction();
                    const result = yield originalMethod.apply(this, [...args, connection]);
                    // 원본 메서드 호출 (이때 connection 인자를 추가로 전달한다! 이 점은 매우 중요)
                    if (manageTransaction)
                        yield connection.commit();
                    return result;
                }
                catch (error) {
                    if (manageTransaction && !(error instanceof HttpError)) {
                        yield connection.rollback();
                        throw new TransactionError('트랜잭션 처리 중 오류.', error);
                    }
                    throw error;
                }
                finally {
                    shared_modules_1.db.release(connection); // 연결 해제
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
