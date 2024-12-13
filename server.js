const app = require('./dist/app').default;
const { container } = require('tsyringe');
const { Database } = require(`./dist/utils/shared-modules`);
const SSEUtil = require(`./dist/utils/SSEUtil`).default;

const db = container.resolve(Database);
const SSE = container.resolve(SSEUtil);

(async () => { // 서버 시작 시 Database 연결 점검
    const conn = await db.getConnection();
    if(conn) {
        console.log("MySQL Connection is OK!");
        db.release(conn);
    }
})();

const server = app.listen(3000, () => {
    console.log('server is running');
});

// 종료 처리
const gracefulShutdown = async () => {
    console.log('Starting graceful shutdown...');
    SSE.closeAllConnections();// SSE 연결 강제 종료
    server.close(async () => {
        try {
            await db.end();
            console.log("MySQL connection pool ended successfully!");
            process.exit(0);
        } catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);