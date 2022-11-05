import { useRouter } from "next/router";

export const useQueryId = (queryId: string) => {
    const id = useRouter().query[queryId] as string;
    return parseInt(id);
}