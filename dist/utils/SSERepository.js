"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
let SSERepository = class SSERepository {
    constructor() {
        this.clients = new Map();
        setInterval(() => this.cleanupClients(), 60000);
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
};
SSERepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], SSERepository);
exports.default = SSERepository;
/**
 * 특징
 * - 단방향 통신으로 서버에서 클라이언트로 일방적인 전송
 * - HTTP 프로토콜 기반으로, 서버와 클라이언트 간의 연결을 계속 유지
 *
 *
 */ 
