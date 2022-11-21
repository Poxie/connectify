import styles from '../../styles/Comments.module.scss';
import { CommentAuthor } from "./CommentAuthor";
import { CommentTimestamp } from "./CommentTimestamp";

export const CommentHeader: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    return(
        <div className={styles['header']}>
            <CommentAuthor commentId={commentId} />
            <CommentTimestamp commentId={commentId} />
        </div>
    )
}