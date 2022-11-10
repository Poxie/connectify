import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useAuth } from "../contexts/auth/AuthProvider";

type UseRequest = <T>(query: string, dispatchAction: any, shouldFetch: boolean) => {
    loading: boolean;
    error: null | string;
}
export const useRequest: UseRequest = <T>(query: string, dispatchAction: any, shouldFetch: boolean) => {
    const { get, loading: tokenLoading } = useAuth();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(tokenLoading || !shouldFetch) return;

        get<T>(query)
            .then(data => {
                dispatch(dispatchAction(data));
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [query, get, tokenLoading, shouldFetch]);

    return { loading, error };
}