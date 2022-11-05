import styles from '../../styles/User.module.scss';
import { useDispatch } from "react-redux";
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store"
import { addUserPostId, addUserPostIds, setUserPostIds, setUserReachedEnd } from "../../redux/users/actions";
import { selectUserExists, selectUserPostIds, selectUserPostsEnd } from "../../redux/users/selectors";
import { Post } from "../../types";
import { ProfilePost } from "./ProfilePost";
import { UserPostSkeleton } from '../user-post/UserPostSkeleton';
import { useTranslation } from 'next-i18next';
import { RequestFinished, useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useQueryId } from '../../hooks/useQueryId';

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 10;
export const UserProfile = () => {
    const { t } = useTranslation('user');
    const dispatch = useDispatch();
    const userId = useQueryId('userId');
    const postIds = useAppSelector(state => selectUserPostIds(state, userId));
    const reachedEnd = useAppSelector(state => selectUserPostsEnd(state, userId));
    const userExists = useAppSelector(state => selectUserExists(state, userId));

    // Fetching posts on mount and scroll
    const onRequestFinished: RequestFinished<Post[]> = (posts, reachedEnd) => {
        if(reachedEnd) {
            dispatch(setUserReachedEnd(userId, 'postIds'));
        }
        dispatch(setPosts(posts));
        dispatch(addUserPostIds(userId, posts.map(post => post.id)))
    }
    const { loading } = useInfiniteScroll<Post[]>(
        `/users/${userId}/posts?amount=${FETCH_AMOUNT}&start_at=${postIds?.length || 0}`,
        onRequestFinished,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            fetchOnMount: !postIds,
            isAtEnd: reachedEnd,
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
                        <ProfilePost 
                            postId={postId}
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