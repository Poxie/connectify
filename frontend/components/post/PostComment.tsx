import { selectCommentById } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { PostCommentContent } from "./PostCommentContent";
import { PostCommentHeader } from "./PostCommentHeader";

export const PostComment: React.FC<{
    id: number;
    postId: number;
}> = ({ id, postId }) => {
    const comment = useAppSelector(state => selectCommentById(state, id));
    if(!comment) return null;

    return(
        <li>
            <PostCommentHeader 
                timestamp={comment.timestamp}
                author={comment.author}
            />
            <PostCommentContent content={comment.content} />
        </li>
    )
}