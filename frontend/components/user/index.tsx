import styles from '../../styles/User.module.scss';
import { useDispatch } from "react-redux";
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store"
import { addUserPostIds } from "../../redux/users/actions";
import { selectUserExists, selectUserPostIds } from "../../redux/users/selectors";
import { Post } from "../../types";
import { UserPostSkeleton } from '../user-post/UserPostSkeleton';
import { useTranslation } from 'next-i18next';
import { RequestFinished, useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useQueryId } from '../../hooks/useQueryId';
import { UserPost } from '../user-post';

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 10;
export const UserProfile = () => {
    const { t } = useTranslation('user');
    const dispatch = useDispatch();
    const userId = useQueryId('userId');
    const postIds = useAppSelector(state => selectUserPostIds(state, userId));
    const userExists = useAppSelector(state => selectUserExists(state, userId));

    // Fetching posts on mount and scroll
    const onRequestFinished: RequestFinished<Post[]> = (posts) => {
        if(!userId) return;
        dispatch(setPosts(posts));
        dispatch(addUserPostIds(userId, posts.map(post => post.id)))
    }
    const { loading, reachedEnd } = useInfiniteScroll<Post[]>(
        `/users/${userId}/posts?amount=${FETCH_AMOUNT}&start_at=${postIds?.length || 0}`,
        onRequestFinished,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            fetchOnMount: !postIds,
            identifier: `user-${userId}`,
            standBy: !userExists
        }
    )

    return(
        <>
            {postIds && postIds?.length === 0 && (
                <span className={styles['empty']}>
                    {t('noPosts')}
                </span>
            )}

            {postIds && postIds?.length !== 0 && (
                <ul className={styles['post-container']}>
                    {postIds.map(postId => (
                        <UserPost 
                            id={postId}
                            key={postId}
                        />
                    ))}
                </ul>
            )}

            {(!postIds || loading) && (
                <div 
                    className={styles['post-container']} 
                    style={{ marginTop: 'var(--spacing-primary)' }}
                >
                    {Array.from(Array(2)).map((_, key) => (
                        <UserPostSkeleton key={key} />
                    ))}
                </div>
            )}

            {reachedEnd && postIds?.length !== 0 && (
                <span className={styles['end']}>
                    {t('postsReachedEnd')}
                </span>
            )}
        </>
    )
}