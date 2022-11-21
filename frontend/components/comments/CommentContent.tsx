import { selectCommentMain } from "../../redux/comments/selectors";
import { useAppSelector } from "../../redux/store";

export const CommentContent: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    const main = useAppSelector(state => selectCommentMain(state, commentId));

    return(
        <span>
            {main?.content}
        </span>
    )
}