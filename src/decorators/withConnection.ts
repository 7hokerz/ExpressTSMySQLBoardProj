import { container } from 'tsyringe';
import { DAOFactory } from '../daos';
import { HttpError } from '../errors';
import Database from '../config/mysql';

export function withConnection<T>(Transaction: boolean = false) {
    return function(_: any, _2: string, descriptor: PropertyDescriptor){
        const originalMethod = descriptor.value;

        descriptor.value = async function (this: any, ...args: any[]): Promise<T> {
            const db = container.resolve(Database);
            const connection = await db.getConnection();
            
            if (!connection) throw new HttpError(500, "데이터베이스 연결 실패");
            try {
                this.daofactory = DAOFactory.getInstance(connection);

                if(Transaction) await connection.beginTransaction();

                const result = await originalMethod.apply(this, [...args]); 

                if(Transaction) await connection.commit();

                return result;
            } catch (error: any) {
                if(Transaction) {
                    await connection.rollback();
                    throw new HttpError(500, '트랜잭션 처리 중 오류.');
                }
                throw error;
            } finally {
                db.release(connection); // 연결 해제
            }
        }
        return descriptor;
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