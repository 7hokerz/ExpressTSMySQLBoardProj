import { Connection, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { QueryResult } from '../utils/types-modules';
import { container, injectable } from "tsyringe";

@injectable()
export class QueryService {
    #connection: Connection | PoolConnection;

    constructor(connection: Connection | PoolConnection) {
        this.#connection = connection;
    }

    async executeQuery<T>(query: string, params?: any[]): Promise<QueryResult<T>> {
        const [rows, fields] = await this.#connection.execute(query, params);
        return {
            rows: rows as T[],                 // 쿼리 결과 행 데이터를 제네릭 타입 배열로 캐스팅
            header: rows as ResultSetHeader    // 결과 헤더 정보(예: INSERT/UPDATE의 메타 데이터)
        };
        // 결과로 반환되는 헤더는 여러가지 정보를 포함
        // 그 중 affectedRows는 변경된 행의 개수 반환
    }
}

container.register("QueryService", { useClass: QueryService });