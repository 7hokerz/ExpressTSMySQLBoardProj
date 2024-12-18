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
     * @param {any[]} [params] - 파라미터 (선택적)
     * @returns {Promise<QueryResult>} - 쿼리에 대한 결과
     */
    static executeQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, params = []) {
            //const startTime = Date.now();
            const [rows, fields] = yield this.connection.execute(query, params);
            //const duration = Date.now() - startTime;
            //console.log(`Execution time: ${duration}ms`);
            return {
                rows: rows, // SELECT 쿼리의 결과
                header: rows // INSERT, UPDATE 등 메타데이터
            };
            // 그 중 affectedRows는 변경된 행의 개수 반환
        });
    }
}
exports.default = QueryExecutor;
