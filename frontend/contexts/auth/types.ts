import { User } from "../../types";

export type AuthContext = {
    get: (query: string) => Promise<any>;
    post: (query: string, body?: Object) => Promise<any>;
    patch: (query: string, body?: Object) => Promise<any>;
    destroy: (query: string) => Promise<any>
    loading: boolean;
    token: string | null;
    profile: null | User;
    setProfile: (user: User) => void;
}