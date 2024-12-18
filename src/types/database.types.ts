import { ResultSetHeader } from "mysql2/promise";

// 쿼리 반환값에 대한 타입
export type QueryResult = {
    rows: any[];
    header: ResultSetHeader;
};