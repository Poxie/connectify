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

export type Channel = {
    id: number;
    icon: string | null;
    name: string | null;
    type: number;
    recipients: User[];
    unread_count: number;
    last_message: Message | null;
    typing?: number;
}
export type Message = {
    id: number;
    channel_id: number;
    author_id: number;
    author: User;
    content: string;
    timestamp: number;
    loading?: boolean;
    tempId?: number;
    failed?: boolean;
}

export type Notification = {
    id: number;
    reference: Message | Post;
    user_reference: User;
    type: 0 | 2;
    unread: boolean;
    created_at: number;
}