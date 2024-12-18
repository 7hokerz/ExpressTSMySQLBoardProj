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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const TokenUtil_1 = __importDefault(require("./utils/TokenUtil"));
const router = express_1.default.Router();
const jwtToken = tsyringe_1.container.resolve(TokenUtil_1.default);
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = []; // 프로미스 객체를 담는 배열
        const username = 'testUser';
        const userId = 1;
        for (let i = 0; i < 100; i++) {
            promises.push(jwtToken.generateAccessToken(username, userId + i));
        }
        const tokens = yield Promise.all(promises);
        return tokens;
    });
}
router.get('/', (req, res) => {
    test().then(tokens => {
        console.log(`tokens generated: ${tokens.length}`);
        const uniqueTokens = new Set(tokens);
        console.log(`Unique tokens generated: ${uniqueTokens.size}`);
    });
    res.redirect('/login');
});
exports.default = router;
/**
 * 토큰 생성은 애초에 CPU 바운드이고 동기적인 작업이라서,
 * node.js는 싱글 스레드 기반이므로 단순 Promise로 감싸는 것은 의미 없음.
 * 워커 스레드를 활용하면 위 작업을 더욱 효율적으로 처리 가능하긴 함.
 *
 * I/O 바운드를 테스트하는 경우에 위 Promise를 활용한 성능 측정이 유용.
 */ 
