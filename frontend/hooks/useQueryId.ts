import { useRouter } from "next/router";

const MANUAL_PARAM_IDS = ['postId'];

const cache: { [key: string]: number } = {};
export const useQueryId = (queryId: string) => {
    // Checking next router query
    const id = useRouter().query[queryId] as string;
    if(queryId !== 'postId') {
        if(id) {
            cache[queryId] = parseInt(id);
            return parseInt(id);
        } else if(cache[queryId]) {
            return cache[queryId];
        }
    }
    if(!MANUAL_PARAM_IDS.includes(queryId)) return 0;

    // Checking URL params
    const asPath = useRouter().asPath;
    const parts = asPath.split('/');
    const postId = parseInt(parts[2]?.split('?')[0]);
    return postId;
}