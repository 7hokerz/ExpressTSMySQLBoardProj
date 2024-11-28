"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_modules_1 = require("../utils/shared-modules");
class DAOFactory {
    constructor() { }
    static getInstance() {
        if (!DAOFactory.instance) {
            DAOFactory.instance = new DAOFactory();
        }
        return DAOFactory.instance;
    }
    createPostDAO(connection) {
        return new shared_modules_1.PostDAO(connection);
    }
    createUserDAO(connection) {
        return new shared_modules_1.UserDAO(connection);
    }
    createCommentDAO(connection) {
        return new shared_modules_1.ReplyDAO(connection);
    }
    createLikeDAO(connection) {
        return new shared_modules_1.LikeDAO(connection);
    }
    createRefreshTokenDAO(connection) {
        return new shared_modules_1.RefreshTokenDAO(connection);
    }
}
exports.default = DAOFactory;
