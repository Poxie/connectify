import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/auth/AuthProvider";

type UseLiveFetching = <T>(query: string) => {
    loading: boolean;
    error: null | string;
    data: T | null;
}
export const useLiveFetching: UseLiveFetching = <T>(query: string) => {
    const { get, loading: tokenLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);

    const cache = useMemo(() => {
        return {} as {[query: string]: T}
    }, []);

    useEffect(() => {
        if(tokenLoading) return;

        if(!query) {
            setLoading(false);
            setData(null);
            return;
        }

        // Checking if result is already in cache
        if(cache[query]) {
            setData(cache[query]);
            return;
        }

        // If not in cache, fetch data
        setLoading(true);

        get<T>(query)
            .then(data => {
                setData(data);
                cache[query] = data;
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [query, get, tokenLoading]);

    return { loading, error, data };
}