export type RawComment = {
    user_id: number;
    username: string;
    comment_id: number;
    content: string;
    created_at: Date;
};

export type RawPost = {
    post_id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: Date;
    like_count: number;
    view_count: number;
    imageurl?: string;
    username: string;
};
