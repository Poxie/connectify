import styles from '../../styles/User.module.scss';
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store"
import { addUserPostId, addUserPostIds, setUserPostIds, setUserReachedEnd } from "../../redux/users/actions";
import { selectUserExists, selectUserHasLoadedPosts, selectUserPostIds, selectUserPostsEnd } from "../../redux/users/selectors";
import { Post } from "../../types";
import { ProfilePost } from "./ProfilePost";
import { UserPostSkeleton } from '../user-post/UserPostSkeleton';
import { useTranslation } from 'next-i18next';
import { ScrollCallback, useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 10;
export const UserProfile = () => {
    const { t } = useTranslation('user');
    const { get } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const postIds = useAppSelector(state => selectUserPostIds(state, parseInt(userId)));
    const reachedEnd = useAppSelector(state => selectUserPostsEnd(state, parseInt(userId)));

    // Testing
    const scrollCallback: ScrollCallback = (posts: Post[], reachedEnd) => {
        if(reachedEnd) {
            dispatch(setUserReachedEnd(parseInt(userId), 'postIds'));
        }
        dispatch(setPosts(posts));
        dispatch(addUserPostIds(parseInt(userId), posts.map(post => post.id)))
    }
    const { loading } = useInfiniteScroll<Post[]>(
        `/users/${userId}/posts?amount=${FETCH_AMOUNT}&start_at=${postIds?.length || 0}`,
        scrollCallback,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            fetchOnMount: !postIds,
            isAtEnd: reachedEnd
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

            {reachedEnd && (
                <span className={styles['end']}>
                    {t('postsReachedEnd')}
                </span>
            )}
        </>
    )
}