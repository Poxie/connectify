import { selectCommentMain } from '../../redux/comments/selectors';
import { useAppSelector } from '../../redux/store';
import { UserPostTimestamp } from '../user-post/UserPostTimestamp';

export const CommentTimestamp: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    const main = useAppSelector(state => selectCommentMain(state, commentId));
    if(!main) return null;

    return <UserPostTimestamp timestamp={main.timestamp} />
}