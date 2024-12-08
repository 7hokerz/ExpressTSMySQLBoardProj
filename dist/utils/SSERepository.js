"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SSERepository {
    constructor() {
        this.clients = new Map();
        setInterval(() => this.cleanupClients(), 60000);
    }
    static getInstance() {
        if (!SSERepository.instance) {
            SSERepository.instance = new SSERepository();
        }
        return SSERepository.instance;
    }
    notifyClients(userId, data) {
        if (this.clients.has(userId)) {
            this.clients.get(userId).forEach((client) => client.write(`data: ${JSON.stringify(data)}\n\n`));
        }
    }
    addClient(userId, res) {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, []);
        }
        this.clients.get(userId).push(res);
        console.log(`Client connected: userId=${userId}`);
        console.log(`연결 수: ${this.clients.get(userId).length}`);
    }
    removeClient(userId, res) {
        if (this.clients.has(userId)) {
            const responses = this.clients.get(userId).filter((client) => client !== res);
            if (responses.length > 0) {
                this.clients.set(userId, responses);
            }
            else {
                this.clients.delete(userId);
            }
            console.log(`Client disconnected: userId=${userId}`);
        }
    }
    cleanupClients() {
        this.clients.forEach((responses, userId) => {
            const activeResponses = responses.filter((res) => !res.writableEnded);
            if (activeResponses.length > 0) {
                this.clients.set(userId, activeResponses);
            }
            else {
                this.clients.delete(userId);
            }
            console.log(`연결 정리됨: ${this.clients.get(userId).length}`);
        });
    }
    closeAllConnections() {
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
exports.default = SSERepository.getInstance();
/**
 * 특징
 * - 단방향 통신으로 서버에서 클라이언트로 일방적인 전송
 * - HTTP 프로토콜 기반으로, 서버와 클라이언트 간의 연결을 계속 유지
 *
 *
 */ 
