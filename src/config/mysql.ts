import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { container, singleton } from "tsyringe";
import env from './index';

@singleton()
export default class Database {
    #pool: Pool;
    #activeConnections: Set<PoolConnection> = new Set(); // 커넥션들을 담는 Set
    
    constructor() {
      this.#pool = mysql.createPool({
        host: env.db.host,
        port: parseInt(env.db.port as string, 10),
        user: env.db.uid,
        password: env.db.pwd,
        database: env.db.database,
        connectionLimit: 10,
        enableKeepAlive: true, // Keep-Alive 활성화
        keepAliveInitialDelay: 10000, // Keep-Alive 초기 지연 (ms 단위)
      });
    }
    
    public async getConnection(): Promise<PoolConnection> { // DB 연결
      try {
        const conn = await this.#pool.getConnection();
        this.#activeConnections.add(conn);
        return conn;
      } catch(error) {
        console.error("MySQL connection error: " + error);
        throw new Error;
      }
    }

    public release(conn: PoolConnection): void { // DB 연결 반환
      try {
        conn.release();
        this.#activeConnections.delete(conn);
      }catch(error) {
        console.error("Failed to release connection:", error);
      }
    }

    public async end(): Promise<void> { // DB 연결 종료
      try {
        const activeConnections = await this.fetchActiveConnections();
        
        for (const conn of activeConnections) this.release(conn);
        
        await this.#pool.end();
      } catch (error) {
        console.error("Failed to close the pool:", error);
      }
    }
    // 연결된 모든 커넥션들을 반환
    private async fetchActiveConnections(): Promise<PoolConnection[]> {
      return Array.from(this.#activeConnections);
    }
}
container.register('Database', { useClass: Database });
/*
  DB 연결 및 종료 함수를 모듈 형식으로 반환

  mysql2/promise: DB를 활용할 때 async/await의 비동기 방식으로 작성 가능

  getConnection()로 연결 설정 후 연결을 반환해야 함. 
  그렇지 않으면 점유한 상태로 존재하게 됨.
*/