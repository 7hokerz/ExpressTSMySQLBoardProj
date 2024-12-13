import { container } from 'tsyringe';
import { DAOFactory } from '../daos';
import { HttpError } from '../errors';
import Database from '../config/mysql';

export function Transaction(target: any, propertyKey: string) {
    Reflect.defineMetadata('Transaction', true, target, propertyKey);
}

export function withDB<T extends { new (...args: any[]): {} }>(constructor: T) { // 클래스(생성자 함수)가 전달된다.
    const methodNames = Object.getOwnPropertyNames(constructor.prototype)
        .filter(name => name !== 'constructor'); // 모든 메서드 가져오기

    const db = container.resolve(Database);

    for (const methodName of methodNames) {
        const originalMethod = constructor.prototype[methodName];
        const isTransaction = Reflect.getMetadata(
            'Transaction', constructor.prototype, methodName);

        if(typeof originalMethod === 'function') {
            constructor.prototype[methodName] = async function (...args: any[]) {
                const connection = await db.getConnection();
                
                if (!connection) throw new HttpError(500, "데이터베이스 연결 실패");
                try {
                    this.daofactory = DAOFactory.getInstance(connection);

                    if(isTransaction) await connection.beginTransaction();

                    const result = await originalMethod.apply(this, [...args]); 

                    if(isTransaction) await connection.commit();

                    return result;
                } catch (error: any) {
                    if(isTransaction) {
                        await connection.rollback();
                        throw new HttpError(500, '트랜잭션 처리 중 오류.');
                    }
                    throw new HttpError(500, '서비스 처리 중 오류.');
                } finally {
                    db.release(connection);
                }
            }
        }
    }
}


/**
 * DB의 커넥션 연결 및 해제 역할을 담당하는 데코레이터
 * 
 * - DB 객체는 의존성 주입
 * 
 * - DAOFactory 객체 주입 (개별 DAO는 서비스 레이어에서 생성)
 * 
 * - 선택적인 트랜잭션 기능
 * 
 * 
 */