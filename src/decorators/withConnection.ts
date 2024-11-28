import { db } from '../utils/shared-modules';

// DB 커넥션 데코레이터
export function withConnection<T>(
    manageTransaction: boolean = false, 
    HttpError: any, 
    TransactionError?: any
) {
    return function(_: any, _2: string, descriptor: PropertyDescriptor){
        const originalMethod = descriptor.value;
    
        descriptor.value = async function (...args: any[]): Promise<T> {
            const connection = await db.getConnection();
            if (!connection) {
                throw new HttpError(500, "데이터베이스 연결 실패");
            }
            try {
                if(manageTransaction) await connection.beginTransaction();
                
                const result = await originalMethod.apply(this, [...args, connection]); 
                // 원본 메서드 호출 (이때 connection 인자를 추가로 전달한다! 이 점은 매우 중요)
                if(manageTransaction) await connection.commit();

                return result;
            } catch (error) {
                if(manageTransaction && !(error instanceof HttpError)){
                    await connection.rollback();
                    throw new TransactionError('트랜잭션 처리 중 오류.', error);
                }
                throw error;
            } finally {
                db.release(connection); // 연결 해제
            }
        }
        return descriptor;
    }
}

/*
    DB 연결에 관한 데코레이터
    
    DB 연결 및 해제를 자동화하고
    상황에 따라 트랜잭션도 자동화할 수 있다.

    커넥션을 데코레이터에서 생성하고 해제하므로
    역할 분리가 가능
*/