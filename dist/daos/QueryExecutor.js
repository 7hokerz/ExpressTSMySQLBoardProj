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
class QueryExecutor {
    static initialize(connection) {
        QueryExecutor.connection = connection;
    }
    /**
     * 쿼리에 대한 결과를 반환하는 메서드
     * @param {string} query - 쿼리문
     * @param {any[]} [params] - 데이터 (선택적)
     * @returns {Promise<QueryResult<T>>} - 쿼리에 대한 결과
     */
    static executeQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            params = params || [];
            const [rows, fields] = yield this.connection.execute(query, params);
            return {
                rows: rows, // 쿼리 결과 행 데이터를 제네릭 타입 배열로 캐스팅
                header: rows // 결과 헤더 정보(예: INSERT/UPDATE의 메타 데이터)
            };
            // 결과로 반환되는 헤더는 여러가지 정보를 포함
            // 그 중 affectedRows는 변경된 행의 개수 반환
        });
    }
}
exports.default = QueryExecutor;
