import { useRouter } from "next/router";

const cache: { [key: string]: number } = {};
export const useQueryId = (queryId: string) => {
    const id = useRouter().query[queryId] as string;
    if(id) {
        cache[queryId] = parseInt(id);
        return parseInt(id);
    } else {
        return cache[queryId];
    }
}