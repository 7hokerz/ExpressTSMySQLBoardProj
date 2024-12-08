import { Connection, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { QueryResult } from '../utils/types-modules';

export default class QueryExecutor {
    private static connection: Connection | PoolConnection;
    
    public static initialize(connection: Connection | PoolConnection): void {
        QueryExecutor.connection = connection;
    }
    /**
     * 쿼리에 대한 결과를 반환하는 메서드
     * @param {string} query - 쿼리문
     * @param {any[]} [params] - 데이터 (선택적)
     * @returns {Promise<QueryResult<T>>} - 쿼리에 대한 결과
     */
    public static async executeQuery<T>(query: string, params?: any[]): Promise<QueryResult<T>> {
        params = params || [];
        const [rows, fields] = await this.connection.execute(query, params);
        return {
            rows: rows as T[],                 // 쿼리 결과 행 데이터를 제네릭 타입 배열로 캐스팅
            header: rows as ResultSetHeader    // 결과 헤더 정보(예: INSERT/UPDATE의 메타 데이터)
        };
        // 결과로 반환되는 헤더는 여러가지 정보를 포함
        // 그 중 affectedRows는 변경된 행의 개수 반환
    }
}