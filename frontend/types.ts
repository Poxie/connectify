export type User = {
    id: string;
    username: string;
    display_name: string | null;
    follower_count: number;
    is_following: boolean;
}