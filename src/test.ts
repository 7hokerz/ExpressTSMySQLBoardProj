import express, { Request, Response } from 'express';
import { container } from 'tsyringe';
import JwtToken from './utils/TokenUtil';

const router = express.Router();

const jwtToken = container.resolve(JwtToken);

async function test() {
  const promises = []; // 프로미스 객체를 담는 배열
  const username = 'testUser';
  const userId = 1;

  for (let i = 0; i < 100; i++) {
    promises.push(jwtToken.generateAccessToken(username, userId + i));
  }

  const tokens = await Promise.all(promises);
  return tokens;
}

router.get('/', (req: Request, res: Response) => {
    test().then(tokens => {
        console.log(`tokens generated: ${tokens.length}`);
        const uniqueTokens = new Set(tokens);
        console.log(`Unique tokens generated: ${uniqueTokens.size}`);
        
    });
    res.redirect('/login');
});

export default router;

/**
 * 토큰 생성은 애초에 CPU 바운드이고 동기적인 작업이라서,
 * node.js는 싱글 스레드 기반이므로 단순 Promise로 감싸는 것은 의미 없음.
 * 워커 스레드를 활용하면 위 작업을 더욱 효율적으로 처리 가능하긴 함.
 * 
 * I/O 바운드를 테스트하는 경우에 위 Promise를 활용한 성능 측정이 유용.
 */