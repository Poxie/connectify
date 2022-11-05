import styles from '../../styles/Post.module.scss';
import { usePostId } from "../../hooks/usePostId"
import { selectPostCommentCount } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { CommentInput } from "./CommentInput"
import { useTranslation } from 'next-i18next';
import { CommentInputSkeleton } from './CommentInputSkeleton';

export const CommentInputSection = () => {
    const { t } = useTranslation('common');
    const postId = usePostId();
    const commentCount = useAppSelector(state => selectPostCommentCount(state, postId));

    if(commentCount === undefined) {
        return <CommentInputSkeleton />;
    }

    return(
        <>
            <span className={styles['comments-header']}>
                {commentCount} {t('comments')}
            </span>

            <CommentInput postId={postId} />
        </>
    )
}