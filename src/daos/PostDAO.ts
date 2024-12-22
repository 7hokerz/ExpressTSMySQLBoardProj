import { PoolConnection } from 'mysql2/promise';
import QueryExecutor from './QueryExecutor';
import { IPostRepository } from '../domain/interfaces';
import { NotFoundError } from '../errors';

export default class PostDAO implements IPostRepository {
    constructor(connection: PoolConnection) {
        QueryExecutor.initialize(connection);
    }

    async getPaginatedPosts(limit: number, offset: number): Promise<any> {
        const query = 
        `SELECT P.post_id, P.title, P.created_at, P.view_count, L.like_count
        FROM posts P
        LEFT JOIN (
            SELECT post_id, COUNT(like_id) AS like_count
            FROM postLike
            GROUP BY post_id
        ) L
        ON P.post_id = L.post_id
        ORDER BY P.created_at DESC
        LIMIT ? OFFSET ?`

        const { rows } = await QueryExecutor.executeQuery(query, [String(limit), String(offset)]);
        return rows;
    }

    async getPostsCount(): Promise<any> {
        const query = `SELECT COUNT(*) AS total_posts FROM posts`;

        const { rows } = await QueryExecutor.executeQuery(query);
        return rows;
    }

    async getPostDetails(postId: number): Promise<any | null> {
        const postQuery = `
            SELECT P.*, U.username, 
            (
                SELECT COUNT(*) 
                FROM postLike L
                WHERE L.post_id = P.post_id
            ) AS like_count
            FROM posts P
            JOIN users U ON P.user_id = U.id 
            WHERE P.post_id = ?
            LOCK IN SHARE MODE`;
        const commentQuery = `
            SELECT C.*, U.username
            FROM comments C
            JOIN users U ON C.user_id = U.id
            WHERE C.post_id = ?
            ORDER BY C.created_at ASC`;
        
        // 병렬 처리로 속도 개선
        const [postRow, commentRow] = await Promise.all([
            QueryExecutor.executeQuery(postQuery, [postId]),
            QueryExecutor.executeQuery(commentQuery, [postId])
        ]);

        const posts = postRow.rows[0];
        
        if(!posts) return null; 
        const comments = commentRow.rows;

        return {posts, comments};
    }

    async getPostDetailsYN(postId: number): Promise<any | null> {
        const query = `
        SELECT user_id, imageurl
        FROM posts
        WHERE post_id = ?
        FOR UPDATE`;
        
        const { rows } = await QueryExecutor.executeQuery(query, [postId]);
        
        return rows[0] || null;
    }

    async deletePost(postId: number): Promise<void> {
        const query = `
        DELETE FROM posts 
        WHERE post_id = ?`;

        const { header } = await QueryExecutor.executeQuery(query, [postId]);
        
        if(header.affectedRows === 0) {
            throw new NotFoundError(`Post with ID ${postId}`);
        }
    }

    async updatePost(post: any): Promise<void> {
        const { post_id, title, content } = post;
        const query = `
        UPDATE posts 
        SET title = ?, content = ? 
        WHERE post_id = ?`;

        const { header } = await QueryExecutor.executeQuery(query, [title, content, post_id]);

        if (header.affectedRows === 0) {
            throw new Error(`Post with ID ${post.post_id} not found`);
        }
    }

    async createPost(post: any, userId: number): Promise<void> {
        const { title, content, imagePath } = post;
        const query = `
        INSERT INTO posts (user_id, title, content, imageurl) 
        VALUES (?, ?, ?, ?)`;
        
        await QueryExecutor.executeQuery(query, [userId, title, content, imagePath ?? null]);
    }
}

/*
    managePost.js의 주요 기능 설명
    - getPosts(): 모든 게시글을 불러옴
    - getPostDetails(): 특정 게시글의 정보를 불러옴
    게시글의 정보
    - getPostDetailsYN(): 특정 게시글의 존재 유무 확인
    작성자와 유저 검증을 위해 user_id를 불러온다.
    배타 락 사용

    - deletePost(): 특정 게시글을 삭제
    - updatePost(): 특정 게시글을 업데이트
    - createPost(): 특정 게시글을 생성
        게시글을 생성할 때 작성자의 id를 받아 작성자를 구별

    managePost.js 주요 편집 내용
    - 모든 게시물 목록을 표시할 때, 게시물 마다
    좋아요 수를 카운트하여 표시하는 쿼리문 추가

    하지만 조회 쿼리문이 비효율적이므로, 다른 기법을 사용할 필요가 있음.
    >> 조인을 사용하여 쿼리문을 1번만 호출하도록 개선

    - getPostDetails() 함수의 쿼리를 수정
    기존:
    SELECT P.*, U.username, 
        COUNT(L.like_id) AS like_count
        FROM posts P
        JOIN users U ON P.user_id = U.id 
        LEFT JOIN postLike L
        ON P.post_id = L.post_id
        WHERE P.post_id = ?
        GROUP BY P.post_id
        LOCK IN SHARE MODE
    위 쿼리도 효율성에서 큰 문제가 없다고 한다.
    조인으로 좋아요, 유저에 대한 행을 묶고 특정 게시물만 필터링.
    
    현재:
    SELECT P.*, U.username, 
            (SELECT COUNT(*) 
            FROM postLike L
            WHERE L.post_id = P.post_id) AS like_count
        FROM posts P
        JOIN users U ON P.user_id = U.id 
        WHERE P.post_id = ?
        LOCK IN SHARE MODE
    조인으로 묶고 특정 게시물만 필터링 후, 서브쿼리로
    해당 게시물에 대해서만 좋아요 카운트를 계산함.

    추후 수정 및 추가할 내용?
    - 
    
*/