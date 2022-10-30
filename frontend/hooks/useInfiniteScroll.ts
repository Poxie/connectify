import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth/AuthProvider";

export type ScrollCallback = (result: any, reachedEnd: boolean) => void;
type InfiniteScroll = <T>(query: string, onRequestFinished: ScrollCallback, options: {
    threshold: number;
    fetchAmount: number;
}) => {
    loading: boolean;
    reachedEnd: boolean;
}

export const useInfiniteScroll: InfiniteScroll = (query, onRequestFinished, options) => {
    const { get, token, loading: tokenLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const fetching = useRef(false);

    // Handling event listeners
    useEffect(() => {
        if(!token) return;

        const onScroll = async () => {
            if(fetching.current) return;
            const diffFromBottom = Math.abs(window.scrollY + window.innerHeight - document.body.offsetHeight);
                
            if(diffFromBottom < options.threshold) {
                fetching.current = true;
                const result: any = await get(query);
                const reachedEnd = result.length < options.fetchAmount;
                
                fetching.current = false;
                setLoading(false);
                onRequestFinished(result, reachedEnd);
                setReachedEnd(reachedEnd);
    
                if(reachedEnd) {
                    window.removeEventListener('scroll', onScroll);
                }
            }
        }

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [get, token, tokenLoading, query]);

    return {
        loading,
        reachedEnd
    }
}