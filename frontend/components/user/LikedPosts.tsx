import styles from '../../styles/User.module.scss';
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store";
import { addUserLikedIds, setUserLikedIds, setUserReachedEnd } from "../../redux/users/actions";
import { selectUserExists, selectUserHasLoadedLikedPosts, selectUserLikedIds, selectUserLikedPostsEnd } from "../../redux/users/selectors";
import { Post } from "../../types";
import { UserPostSkeleton } from "../user-post/UserPostSkeleton";
import { ProfilePost } from './ProfilePost';
import { useTranslation } from 'next-i18next';
import { ScrollCallback, useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 10;
export const LikedPosts = () => {
    const { t } = useTranslation('user');
    const { get } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const userExists = useAppSelector(state => selectUserExists(state, parseInt(userId)));
    const postIds = useAppSelector(state => selectUserLikedIds(state, parseInt(userId)));
    const reachedEnd = useAppSelector(state => selectUserLikedPostsEnd(state, parseInt(userId)));
    const userHasLoadedPosts = useAppSelector(state => selectUserHasLoadedLikedPosts(state, parseInt(userId)));
    const fetching = useRef(false);

    // Testing
    const scrollCallback: ScrollCallback = (posts: Post[], reachedEnd) => {
        if(reachedEnd) {
            dispatch(setUserReachedEnd(parseInt(userId), 'likedIds'));
        }
        dispatch(setPosts(posts));
        dispatch(addUserLikedIds(parseInt(userId), posts.map(post => post.id)))
    }
    const { loading } = useInfiniteScroll(
        `/users/${userId}/likes?amount=${FETCH_AMOUNT}&start_at=${postIds?.length || 0}`,
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
            {postIds?.length === 0 && (
                <span className={styles['empty']}>
                    {t('noLikedPosts')}
                </span>
            )}

            {postIds && postIds.length !== 0 && (
                <ul className={styles['post-container']}>
                    {postIds.map(id => (
                        <ProfilePost 
                            postId={id}
                            key={id}
                        />
                    ))}
                </ul>
            )}

            {(!postIds || loading) && (
                <div className={styles['post-container']}>
                    {Array.from(Array(2)).map((_, key) => (
                        <UserPostSkeleton key={key} />
                    ))}
                </div>
            )}

            {reachedEnd && postIds?.length !== 0 && (
                <span className={styles['end']}>
                    {t('likedReachedEnd')}
                </span>
            )}
        </>
    )
}