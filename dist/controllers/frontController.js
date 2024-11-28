"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class frontController {
    constructor() { }
    static getInstance() {
        if (!frontController.instance) {
            frontController.instance = new frontController();
        }
        return frontController.instance;
    }
    // 메인 핸들러
    handle(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield action.execute(req, res, next);
                    this.handleResponse(res, result);
                }
                catch (error) {
                }
            });
        });
    }
    // 응답 처리 핸들러
    handleResponse(res, result) {
        var _a, _b;
        if (result.success) {
            if ((_a = result.data) === null || _a === void 0 ? void 0 : _a.view) {
                res.render(result.data.view, result.data.params);
            }
            else if ((_b = result.data) === null || _b === void 0 ? void 0 : _b.redirect) {
                res.redirect(result.data.redirect);
            }
            else {
                res.status(result.status).json(result);
            }
        }
        else {
        }
    }
}
exports.default = new frontController();
