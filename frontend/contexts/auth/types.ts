import { User } from "../../types";

export type AuthContext = {
    get: <T>(query: string) => Promise<T>;
    post: <T>(query: string, body?: Object) => Promise<T>;
    patch: <T>(query: string, body?: Object) => Promise<T>;
    destroy: <T>(query: string) => Promise<T>
    loading: boolean;
    token: string | null;
    profile: null | User;
    setProfile: (user: User) => void;
}

export type ExtendedError = Error & {
    code: number;
}