import { useRouter } from "next/router";

const cache: { [key: string]: number } = {};
export const useQueryId = (queryId: string, withCache=true) => {
    const id = useRouter().query[queryId] as string;
    if(id) {
        cache[queryId] = parseInt(id);
        return parseInt(id);
    } else if(withCache) {
        return cache[queryId];
    }
}