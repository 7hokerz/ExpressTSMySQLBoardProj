"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAOFactory {
    constructor(connection) {
        this.connection = connection;
    }
    static getInstance(connection) {
        return new DAOFactory(connection);
    }
    getDAO(daoclass) {
        return new daoclass(this.connection);
    }
}
exports.default = DAOFactory;
