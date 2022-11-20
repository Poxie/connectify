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

export const PostMain: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { get, loading } = useAuth();
    const post = useAppSelector(state => selectPostMain(state, postId));
    useRequest(postId ? `/posts/${postId}` : '', setPost, !post);

    if(!post) return <PostMainSkeleton />;

    const {
        id,
        author,
        timestamp,
        title,
        content,
        privacy
    } = post;
    return(
        <>
        <UserPostHeader 
            user={author}
            timestamp={timestamp}
            postId={id}
            privacy={privacy}
        />
        {title && (
            <PostTitle title={title} />
        )}
        <PostContent content={content} />
        <UserPostAttachments authorId={post.author.id} id={id} />
        <UserPostFooter authorId={post.author.id} id={id} />
        </>
    )
}