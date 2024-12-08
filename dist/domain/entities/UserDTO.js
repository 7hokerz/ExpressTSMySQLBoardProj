"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
class UserDTO {
    constructor(user_id, username, pwd) {
        this.user_id = user_id;
        this.username = username;
        this.pwd = pwd;
    }
    getPwd() {
        return this.pwd;
    }
}
exports.UserDTO = UserDTO;
