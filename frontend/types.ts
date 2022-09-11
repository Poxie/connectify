export type User = {
    id: number;
    username: string;
    display_name: string | null;
    follower_count: number;
    is_following: boolean;
}
export type Post = {
    id: number;
    author: User;
    author_id: number;
    title: string;
    content: string;
    has_liked: boolean;
    like_count: number;
    comment_count: number;
    timestamp: number;
}