import { PoolConnection } from 'mysql2/promise';

// 커넥션 관리 인터페이스 (동 커넥션에 대해 싱글턴 패턴 적용)
interface DAOFactoryInstances extends Map<PoolConnection | Symbol, DAOFactory> {}

export default class DAOFactory {
    private static instances: DAOFactoryInstances = new Map();

    private constructor(private readonly connection: PoolConnection) {}

    public static getInstance(connection: PoolConnection): DAOFactory {
        const connectionId = (connection as any).threadId || Symbol();

        if(!this.instances.has(connectionId)) {
            this.instances.set(connectionId, new DAOFactory(connection));
        }
        //console.log(`연결된 커넥션 ID: ${connectionId}, size: ${this.instances.size}`);
        return this.instances.get(connectionId)!;
    }

    public getDAO<T>(
        daoclass: new (connection: PoolConnection) => T
    ):T {
        return new daoclass(this.connection);
    }
}
/**
 * DAO 인스턴스를 반환하는 DAOFactory 클래스
 * - 커넥션에 한하여 싱글턴 패턴 적용
 * - 커넥션마다 개별 스레드 ID가 존재하므로 이를 통해 커넥션을 구별한다.
 * 
 * - 
 * 
 * 
 * 
 */