import { useAuth } from "../../contexts/auth/AuthProvider"
import { useQueryId } from "../../hooks/useQueryId"
import { useRequest } from "../../hooks/useRequest"
import { setPost } from "../../redux/posts/actions"
import { selectPostMain } from "../../redux/posts/selectors"
import { useAppSelector } from "../../redux/store"
import { UserPostAttachments } from "../user-post/UserPostAttachments"
import { UserPostFooter } from "../user-post/UserPostFooter"
import { UserPostHeader } from "../user-post/UserPostHeader"
import { PostContent } from "./PostContent"
import { PostMainSkeleton } from "./PostMainSkeleton"
import { PostTitle } from "./PostTitle"

export const PostMain = () => {
    const { get, loading } = useAuth();
    const postId = useQueryId('postId');
    const post = useAppSelector(state => selectPostMain(state, postId));
    useRequest(postId ? `/posts/${postId}` : '', setPost, !post);

    if(!post) return <PostMainSkeleton />;

    const {
        id,
        author,
        timestamp,
        title,
        content
    } = post;
    return(
        <>
        <UserPostHeader 
            user={author}
            timestamp={timestamp}
            postId={id}
        />
        <PostTitle title={title} />
        <PostContent content={content} />
        <UserPostAttachments id={id} />
        <UserPostFooter id={id} />
        </>
    )
}