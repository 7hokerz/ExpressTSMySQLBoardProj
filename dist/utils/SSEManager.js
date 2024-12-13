"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SSEManager {
    constructor() {
        this.clients = {};
    }
    static getInstance() {
        if (!SSEManager.instance) {
            SSEManager.instance = new SSEManager();
        }
        return SSEManager.instance;
    }
    addClient(userId, res) {
        if (!this.clients[userId]) {
            this.clients[userId] = [];
        }
        this.clients[userId].push(res);
    }
    removeClient(userId, res) {
        if (this.clients[userId]) {
            this.clients[userId] = this.clients[userId].filter((client) => client !== res);
            if (this.clients[userId].length === 0) {
                delete this.clients[userId];
            }
        }
    }
    notifyClients(userId, data) {
        if (this.clients[userId]) {
            this.clients[userId].forEach((client) => client.write(`data: ${JSON.stringify(data)}\n\n`));
        }
    }
}
exports.default = SSEManager.getInstance();
