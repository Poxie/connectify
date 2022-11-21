import styles from '../../styles/Comments.module.scss';
import { CommentAvatar } from './CommentAvatar';
import { CommentMain } from './CommentMain';
import { CommentOptions } from './CommentOptions';

export const Comment: React.FC<{
    id: number;
}> = ({ id }) => {
    return(
        <div className={styles['comment']}>
            <div className={styles['content']}>
                <CommentAvatar commentId={id} />
                <CommentMain commentId={id} />
            </div>
            <CommentOptions commentId={id} />
        </div>
    )
}