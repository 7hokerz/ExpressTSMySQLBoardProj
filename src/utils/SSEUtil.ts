import { Response } from 'express';
import { singleton } from 'tsyringe';

// 클라이언트 접속 관리 인터페이스 (userId, 응답 객체 배열)
interface SSEClients extends Map<number, Response[]> {}

@singleton()
export default class SSEUtil { 
    private readonly clients: SSEClients = new Map();

    constructor() {
        setInterval(() => this.cleanupClients(), 60000);
    }

    public notifyClients(userId: number, data: any): void {
        if (this.clients.has(userId)) {
            this.clients.get(userId)!.forEach((client) =>
                client.write(`data: ${JSON.stringify(data)}\n\n`)
            );
        }
    }

    public addClient(userId: number, res: Response): void {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, []);
        }
        this.clients.get(userId)!.push(res);
        //console.log(`Client connected: userId=${userId}`);
        //console.log(`연결 수: ${this.clients.get(userId)!.length}`);
    }

    public removeClient(userId: number, res: Response): void {
        if (this.clients.has(userId)) {
            const responses = this.clients.get(userId)!.filter((client) => client !== res);

            if (responses.length > 0) {
                this.clients.set(userId, responses);
            } else {
                this.clients.delete(userId);
            }
            //console.log(`Client disconnected: userId=${userId}`);
        }
    }
    // 가비지 컬렉터 (쓰이지 않는 연결 주기적 종료)
    private cleanupClients(): void {
        this.clients.forEach((responses, userId) => {
            const activeResponses = responses.filter((res) => !res.writableEnded);

            if (activeResponses.length > 0) {
                this.clients.set(userId, activeResponses);
            } else {
                this.clients.delete(userId);
            }
            //console.log(`연결 정리됨: ${this.clients.get(userId)!.length}`);
        });
    }
    // 모든 커넥션을 강제 종료
    public closeAllConnections(): void {
        this.clients.forEach((responses, userId) => {
            responses.forEach((res) => {
                res.write('event: close\ndata: Server shutting down\n\n');
                res.end();
            });
            this.clients.delete(userId);
        });
        console.log('All SSE connections closed');
    }
}

/**
 * SSE (Server-Sent-Events) 의 특징 
 * - 단방향 통신으로 서버에서 클라이언트로 일방적인 전송
 * - HTTP 프로토콜 기반으로, 서버와 클라이언트 간의 연결을 계속 유지
 * 
 * 의존성 모듈을 이용하여 싱글턴 패턴 사용
 * 
 * clients - Map 자료구조를 사용. key: userId, value: 응답 객체 배열
 * (하나의 클라이언트 당 여러 개의 응답 객체를 넣기 위함.)
 * 
 * @constructor - 주기적으로 가비지 컬렉터를 호출
 * 
 * notifyClients
 * - clients에 있는 응답 객체에 데이터를 포함
 * 
 * addClient
 * - clients에 응답 객체를 추가
 * 
 * removeClient
 * - clients에 있는 응답 객체를 초기화
 * - 또는 맵에서 클라이언트를 제거
 * 
 * cleanupClients
 * - 주기적으로 종료된 응답 객체를 필터링
 * 
 * closeAllConnections
 * - 모든 클라이언트와의 연결을 즉시 해제
 * 
 */