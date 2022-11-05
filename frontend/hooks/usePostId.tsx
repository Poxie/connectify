import { useRouter } from "next/router"

export const usePostId = () => {
    const { postId } = useRouter().query as { postId: string };
    return parseInt(postId);
}