import { Connection, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { QueryResult } from '../utils/types-modules';

export default class QueryExecutor {
    private static connection: PoolConnection;
    
    public static initialize(connection: PoolConnection): void {
        QueryExecutor.connection = connection;
    }
    /**
     * 쿼리에 대한 결과를 반환하는 메서드
     * @param {string} query - 쿼리문
     * @param {any[]} [params] - 파라미터 (선택적)
     * @returns {Promise<QueryResult>} - 쿼리에 대한 결과
     */
    public static async executeQuery(
        query: string, 
        params: any[] = []
    ): Promise<QueryResult> {
        //const startTime = Date.now();
        const [rows, fields] = await this.connection.execute(query, params);
        //const duration = Date.now() - startTime;

        //console.log(`Execution time: ${duration}ms`);
        return {
            rows: rows as any[],               // SELECT 쿼리의 결과
            header: rows as ResultSetHeader    // INSERT, UPDATE 등 메타데이터
        };
        // 그 중 affectedRows는 변경된 행의 개수 반환
    }
}