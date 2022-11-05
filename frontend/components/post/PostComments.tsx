import styles from '../../styles/Post.module.scss';
import { selectPostCommentCount, selectPostCommentIds, selectPostHasLoadedComments, selectPostMain } from "../../redux/posts/selectors"
import { useAppSelector } from "../../redux/store"
import { PostComment } from './PostComment';
import { AddCommentInput } from './AddCommentInput';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { setPostComments } from '../../redux/posts/actions';
import { useDispatch } from 'react-redux';
import { Comment } from '../../types';
import { Filters } from '../filters/Filters';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { PostCommentSkeleton } from './PostCommentSkeleton';

const FETCH_AMOUNT = 15;
const SCROLL_THRESHOLD = 400;
export const PostComments: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { t: g } = useTranslation('post');
    const dispatch = useDispatch();
    const [orderType, setOrderType] = useState<Comment['orderType']>('top');
    const commentIds = useAppSelector(state => selectPostCommentIds(state, postId, orderType));
    const commentCount = useAppSelector(state => selectPostCommentCount(state, postId));

    // Test
    const onRequestFinished = (result: Comment[], reachedEnd: boolean) => {
        dispatch(setPostComments(postId, result, orderType));
    }
    const { loading } = useInfiniteScroll(
        `/posts/${postId}/comments?amount=${FETCH_AMOUNT}&start_at=${commentIds.length}&order_by=${orderType}`,
        onRequestFinished,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            fetchOnMount: !commentIds.length,
            identifier: orderType
        }
    )

    return(
        <div className={styles['comments']}>
            <span className={styles['comments-header']}>
                {commentCount} {t('comments')}
            </span>

            <AddCommentInput postId={postId} />
            
            {!commentIds.length && !loading && (
                <span>
                    {g('noPosts')}
                </span>
            )}

            <Filters 
                items={[
                    { text: 'Top', id: 'top' },
                    { text: 'Latest', id: 'latest' }
                ]}
                containerClassName={styles['filters']}
                onChange={id => setOrderType(id as Comment['orderType'])}
            />

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

            {loading && Array.from(Array(4)).map((_,key) => (
                <PostCommentSkeleton key={key} />
            ))}
        </div>
    )
}