const app = require('./dist/app').default;
const { db } = require(`./dist/utils/shared-modules`);

(async () => { // 서버 시작 시 db 연결 점검
    const conn = await db.getConnection();
    if(conn) console.log("MySQL Connection is OK!");
    await db.release(conn);
})();

const server = app.listen(3000, () => {
    console.log('server is running');
});

// 종료 처리
const gracefulShutdown = async () => {
    console.log('Starting graceful shutdown...');
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