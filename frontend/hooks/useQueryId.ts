import { useRouter } from "next/router";

const MANUAL_PARAMS = [{id: 'postId', prefix: 'posts'}];
const MANUAL_PARAM_IDS = MANUAL_PARAMS.map(param => param.id);
const getManualParam = (id: string) => MANUAL_PARAMS.find(param => param.id === id);

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
    if(!MANUAL_PARAM_IDS.includes(queryId)) return;

    // Checking URL params
    const asPath = useRouter().asPath;
    const parts = asPath.split('/');
    if(parts[1] !== getManualParam(queryId)?.prefix) return;
    const postId = parseInt(parts[2]?.split('?')[0]);
    return postId;
}