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
exports.UserResponseDto = exports.UserRequestDto = void 0;
const class_validator_1 = require("class-validator");
class UserRequestDto {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    getPwd() {
        return this.password;
    }
}
exports.UserRequestDto = UserRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s*!]+$/, {
        message: '알파벳 및 공백, *, !만 허용'
    }),
    __metadata("design:type", String)
], UserRequestDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s*!]+$/, {
        message: '알파벳 및 공백, *, !만 허용'
    }),
    __metadata("design:type", String)
], UserRequestDto.prototype, "password", void 0);
class UserResponseDto {
    constructor(user_id, username, pwd) {
        this.user_id = user_id;
        this.username = username;
        this.pwd = pwd;
    }
    getPwd() {
        return this.pwd;
    }
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "pwd", void 0);
/*export class UserDTO {
    @IsNumber()
    readonly user_id: number;

    @IsOptional()
    @IsString()
    readonly username?: string;

    @IsOptional()
    @IsString()
    private readonly pwd? : string;

    constructor(user_id: number, username?: string, pwd? : string){
        this.user_id = user_id;
        this.username = username;
        this.pwd = pwd;
    }

    getPwd(): string | undefined {
        return this.pwd;
    }
}*/ 
