import { User } from "../../types";

export type AuthContext = {
    get: (query: string) => Promise<any>;
    post: (query: string, body?: Object) => Promise<any>;
    destroy: (query: string) => Promise<any>
    loading: boolean;
    profile: null | User;
}