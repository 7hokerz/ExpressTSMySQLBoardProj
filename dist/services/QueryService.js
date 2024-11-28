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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QueryService_connection;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;
const tsyringe_1 = require("tsyringe");
let QueryService = class QueryService {
    constructor(connection) {
        _QueryService_connection.set(this, void 0);
        __classPrivateFieldSet(this, _QueryService_connection, connection, "f");
    }
    executeQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows, fields] = yield __classPrivateFieldGet(this, _QueryService_connection, "f").execute(query, params);
            return {
                rows: rows, // 쿼리 결과 행 데이터를 제네릭 타입 배열로 캐스팅
                header: rows // 결과 헤더 정보(예: INSERT/UPDATE의 메타 데이터)
            };
            // 결과로 반환되는 헤더는 여러가지 정보를 포함
            // 그 중 affectedRows는 변경된 행의 개수 반환
        });
    }
};
exports.QueryService = QueryService;
_QueryService_connection = new WeakMap();
exports.QueryService = QueryService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], QueryService);
tsyringe_1.container.register("QueryService", { useClass: QueryService });
