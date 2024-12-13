import dotenv from 'dotenv';
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

export default {
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        uid: process.env.DB_UID,
        pwd: process.env.DB_PWD,
        database: process.env.DB_DATABASE,
    },
    secret: {
        secret: process.env.JWT_SECRET,
        refreshsecret: process.env.JWT_REFRESHSECRET,
    },
    cookie: {
        user: process.env.USER_COOKIE_KEY,
        user2: process.env.USER_COOKIE_KEY2,
    }
}