import { PoolConnection } from 'mysql2/promise';
import { IUserRepository } from '../domain/interfaces';
import QueryExecutor from './QueryExecutor';

interface UserType {
    username: string;
    password: string;
}

export default class UserDAO implements IUserRepository {
    constructor(connection: PoolConnection) {
        QueryExecutor.initialize(connection);
    }

    async getUser(username: string): Promise<any> {
        const query = `
        SELECT * FROM users 
        WHERE username = ?`;

        const { rows } = await QueryExecutor.executeQuery(query, [username]);

        return rows[0] || null;
    }

    async createUser(newUser: UserType): Promise<void> {
        const query = `
        INSERT INTO users (username, password) 
        VALUES (?, ?)`;
        
        await QueryExecutor.executeQuery(query, [newUser.username, newUser.password]);
    }

    async removeUser(user_id: number): Promise<void> {
        const query = `
        DELETE FROM users 
        WHERE id = ?`;

        await QueryExecutor.executeQuery(query, [user_id]);
    }
    
    async editUser(curUserId: number, editUser: UserType): Promise<void> {
        const query = `
        UPDATE users 
        SET username = ?, password = ? 
        WHERE id = ?`;

        await QueryExecutor.executeQuery(query, 
            [editUser.username, editUser.password, curUserId]);
    }
}

/*
    UserDAO.js의 주요 기능 설명
    - getUser(): DB에서 사용자 정보를 가져오는 함수
    - createUser(): DB에 사용자 정보를 추가하는 함수
    - removeUser(): DB에 있는 사용자 정보를 지우는 함수
    - editUser(): DB에 있는 사용자 정보를 수정하는 함수

    UserDAO.js 주요 편집 내용
    - 

    추후 수정 및 추가할 내용?
    - 현재 유저가 글이나 댓글이 존재하면 회원탈퇴가 불가능한데,
    (DB 제약 조건의 영향)
    이를 위해서는 글이나 댓글을 함께 삭제하거나 
    아니면 회원만 탈퇴되고 글은 남아있거나 하면서
    (탈퇴한 회원)으로 표시되도록 하거나 등의 개선점이 필요
*/