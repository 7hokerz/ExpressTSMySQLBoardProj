"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAOFactory {
    constructor(connection) {
        this.connection = connection;
    }
    static getInstance(connection) {
        const connectionId = connection.threadId || Symbol();
        if (!this.instances.has(connectionId)) {
            this.instances.set(connectionId, new DAOFactory(connection));
        }
        //console.log(`연결된 커넥션 ID: ${connectionId}, size: ${this.instances.size}`);
        return this.instances.get(connectionId);
    }
    getDAO(daoclass) {
        return new daoclass(this.connection);
    }
}
DAOFactory.instances = new Map();
exports.default = DAOFactory;
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
