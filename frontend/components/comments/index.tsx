import { useTranslation } from 'next-i18next';
import { RefObject, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RequestFinished, useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { addComments } from '../../redux/comments/actions';
import { selectCommentIds } from '../../redux/comments/selectors';
import { useAppSelector } from '../../redux/store';
import styles from '../../styles/Comments.module.scss';
import { Comment as CommentType } from '../../types';
import { Comment } from './Comment';
import { CommentFilters } from './CommentFilters';
import { CommentInput } from './CommentInput';
import { CommentSkeleton } from './CommentSkeleton';

const FETCH_AMOUNT = 15;
const SCROLL_THRESHOLD = 400;
const PLACEHOLDER_AMOUNT = 4;
export const Comments: React.FC<{
    postId: number;
    containerRef?: RefObject<HTMLDivElement>;
}> = ({ postId, containerRef }) => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const [orderType, setOrderType] = useState<CommentType['orderType']>('top');
    const commentIds = useAppSelector(state => selectCommentIds(state, postId, orderType));
    
    // Fetching comments
    const onRequestFinished: RequestFinished<CommentType[]> = (result, reachedEnd) => {
        dispatch(addComments(result, orderType));
    }
    const { loading, reachedEnd } = useInfiniteScroll<CommentType[]>(
        `/posts/${postId}/comments?amount=${FETCH_AMOUNT}&start_at=${commentIds.length}&order_by=${orderType}`,
        onRequestFinished,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            identifier: `${postId}-${orderType}`,
            fetchOnMount: commentIds.length < FETCH_AMOUNT,
            scrollContainer: containerRef
        }
    )

    return(
        <div className={styles['container']}>
            <CommentInput postId={postId} />
            <CommentFilters onOrderTypeChange={setOrderType} />

            {commentIds.length !== 0 && (
                <ul className={styles['comment-container']}>
                    {commentIds.map(commentId => (
                        <Comment 
                            id={commentId}
                            key={commentId}
                        />
                    ))}
                </ul>
            )}

            {loading && (
                Array.from(Array(PLACEHOLDER_AMOUNT)).map((_, key) => (
                    <CommentSkeleton key={key} />
                ))
            )}

            {!loading && commentIds.length === 0 && (
                <span className={styles['label']}>
                    {t('noComments')}
                </span>
            )}

            {reachedEnd && commentIds.length !== 0 && (
                <span className={styles['label']}>
                    {t('endOfComments')}
                </span>
            )}
        </div>
    )
}