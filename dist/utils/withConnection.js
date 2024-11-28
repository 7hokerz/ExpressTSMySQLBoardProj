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
exports.DBConnectable = void 0;
exports.withConnection = withConnection;
// Database 관련 동작을 포함할 클래스가 반드시 구현해야 하는 (인터페이스)
// 인터페이스는 public 접근자만 가능하므로 다른 접근자를 사용할 시 추상 클래스를 이용하여 가능
class DBConnectable {
}
exports.DBConnectable = DBConnectable;
// DB 커넥션 데코레이터
function withConnection(manageTransaction = false, HttpError, TransactionError) {
    return function (_, _2, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                if ( // 메서드 구현 확인
                typeof this.initCon !== "function" ||
                    typeof this.releaseCon !== "function" ||
                    typeof this.getCon !== "function") {
                    throw new Error(`Class must implement DatabaseConnectable to use withConnection.`);
                }
                try {
                    yield this.initCon();
                    if (manageTransaction) {
                        const connection = this.getCon();
                        yield (connection === null || connection === void 0 ? void 0 : connection.beginTransaction());
                    }
                    const result = yield originalMethod.apply(this, args); // 원본 메서드 호출
                    if (manageTransaction) {
                        const connection = this.getCon();
                        yield (connection === null || connection === void 0 ? void 0 : connection.commit());
                    }
                    return result;
                }
                catch (error) {
                    if (manageTransaction && !(error instanceof HttpError)) {
                        const connection = this.getCon();
                        yield (connection === null || connection === void 0 ? void 0 : connection.rollback());
                        throw new TransactionError('트랜잭션 처리 중 오류.', error);
                    }
                    throw error;
                }
                finally {
                    yield this.releaseCon(); // 연결 해제
                }
            });
        };
    };
}
/*
    


*/ 
