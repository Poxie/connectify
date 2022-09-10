export type AuthContext = {
    get: (query: string) => Promise<any>;
    post: (query: string) => Promise<any>;
}