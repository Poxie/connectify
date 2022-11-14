import { useRouter } from "next/router";

export const useQueryId = (queryId: string) => {
    // Checking next router query
    const id = useRouter().query[queryId] as string;
    if(id) return parseInt(id);

    // Checking URL params
    const asPath = useRouter().asPath;
    const parts = asPath.split('/');
    const postId = parseInt(parts[2]?.split('?')[0]);
    return postId;
}