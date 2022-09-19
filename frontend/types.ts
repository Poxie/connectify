export type User = {
    id: number;
    username: string;
    display_name: string | null;
    bio: string;
    follower_count: number;
    is_following: boolean;
    is_self: boolean;
    banner: null | string | File;
    avatar: null | string | File;
    postIds?: number[];
    likedIds?: number[];
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
    comments?: Comment[];
}
export type Comment = {
    id: number;
    author_id: number;
    post_id: number;
    author: User;
    content: string;
    timestamp: number;
}