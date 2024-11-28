import { Connection, PoolConnection } from 'mysql2/promise';
import { PostDTO, PostDetailsDTO, CommentDTO, UserDTO } from '../utils/shared-modules';
import { RawComment, RawPost } from '../utils/types-modules';
import { injectable, inject } from 'tsyringe';
import { QueryService } from '../services/QueryService';

@injectable()
export default class PostDAO {
    constructor(
        connection: Connection | PoolConnection,
        @inject(QueryService) private queryService: QueryService = new QueryService(connection)
    ) {}

    async getPosts(): Promise<PostDTO[]> {
        const query = `
            SELECT P.*, COUNT(L.like_id) AS like_count
            FROM posts P
            LEFT JOIN postLike L 
            ON P.post_id = L.post_id
            GROUP BY P.post_id
            ORDER BY created_at DESC`;

        const { rows } = await this.queryService.executeQuery<PostDTO>(query);
        
        return rows.map((post: PostDTO) => new PostDTO(
            post.post_id,
            post.title,
            null,
            post.created_at,
            post.like_count,
            post.view_count,
        ));
    }

    async getPostDetails(postId: number): Promise<PostDetailsDTO | null> {
        const postQuery = `
            SELECT P.*, U.username, 
                (SELECT COUNT(*) 
                FROM postLike L
                WHERE L.post_id = P.post_id) AS like_count
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
            this.queryService.executeQuery<RawPost>(postQuery, [postId]),
            this.queryService.executeQuery<RawComment>(commentQuery, [postId])
        ]);

        const posts = postRow.rows[0];
        if(posts === null || posts === undefined) return null; 
        const comments = commentRow.rows;

        return new PostDetailsDTO(
            new PostDTO(
                posts.post_id,
                posts.title,
                posts.content,
                posts.created_at,
                posts.like_count,
                posts.view_count,
                posts.imageurl,
            ),
            new UserDTO(
                posts.user_id,
                posts.username,
            ),
            (comments as RawComment[]).map(
                (comment) => new CommentDTO(
                    new UserDTO(
                        comment.user_id,
                        comment.username,
                    ),
                    comment.comment_id,
                    comment.content,
                    comment.created_at,
                )
            ),
        );
    }

    async getPostDetailsYN(postId: number): Promise<UserDTO | null> {
        const query = `
        SELECT user_id
        FROM posts P
        WHERE P.post_id = ?
        FOR UPDATE`;
        
        const { rows } = await this.queryService.executeQuery<Pick<RawPost, 'user_id'>>(query, [postId]);
        const stat = rows[0];

        if(stat === null || stat === undefined) return null;

        return new UserDTO(stat.user_id);
    }

    async deletePost(postId: number): Promise<void> {
        const query = `
        DELETE FROM posts 
        WHERE post_id = ?`;

        const { header } = await this.queryService.executeQuery<never>(query, [postId]);
        
        if(header.affectedRows === 0) {
            throw new Error(`Post with ID ${postId} not found`);
        }
    }

    async updatePost(post: Pick<PostDTO, 'post_id' | 'title'| 'content'>): Promise<void> {
        const { post_id, title, content } = post;
        const query = `
        UPDATE posts 
        SET title = ?, content = ? 
        WHERE post_id = ?`;

        const { header } = await this.queryService.executeQuery<never>(query, [title, content, post_id]);

        if (header.affectedRows === 0) {
            throw new Error(`Post with ID ${post.post_id} not found`);
        }
    }

    async createPost(post: Pick<PostDTO, 'title'| 'content' | 'imageurl'>, userId: number): Promise<void> {
        const {title, content, imageurl} = post;
        const query = `
        INSERT INTO posts (user_id, title, content, imageurl) 
        VALUES (?, ?, ?, ?)`;
        await this.queryService.executeQuery<never>(query, [userId, title, content, imageurl ?? null]);
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