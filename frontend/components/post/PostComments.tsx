import styles from '../../styles/Post.module.scss';
import { selectCommentIds } from "../../redux/posts/selectors"
import { useAppSelector } from "../../redux/store"
import { PostComment } from './PostComment';
import { PostCommentSkeleton } from './PostCommentSkeleton';
import { Input } from '../input';
import { AddCommentInput } from './AddCommentInput';
import { useTranslation } from 'next-i18next';

export const PostComments: React.FC<{
    postId: number;
    comment_count: number;
}> = ({ postId, comment_count }) => {
    const { t } = useTranslation('common');
    const { t: g } = useTranslation('post');
    const commentIds = useAppSelector(state => selectCommentIds(state, postId));

    if(!commentIds) return <PostCommentSkeleton />;

    return(
        <div className={styles['comments']}>
            <span className={styles['comments-header']}>
                {comment_count} {t('comments')}
            </span>

            <AddCommentInput postId={postId} />
            
            {!commentIds.length && (
                <span>
                    {g('noPosts')}
                </span>
            )}

            {commentIds.length !== 0 && (
                <ul className={styles['comment-container']}>
                    {commentIds?.map(id => (
                        <PostComment 
                            id={id}
                            postId={postId}
                            key={id}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}