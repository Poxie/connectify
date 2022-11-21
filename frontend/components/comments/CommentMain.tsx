import styles from '../../styles/Comments.module.scss';
import { CommentContent } from './CommentContent';
import { CommentFooter } from './CommentFooter';
import { CommentHeader } from './CommentHeader';

export const CommentMain: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    return(
        <div className={styles['main']}>
            <CommentHeader commentId={commentId} />
            <CommentContent commentId={commentId} />
            <CommentFooter commentId={commentId} />
        </div>
    )
}