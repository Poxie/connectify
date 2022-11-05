import styles from '../../styles/User.module.scss';
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store";
import { addUserLikedIds, setUserLikedIds, setUserReachedEnd } from "../../redux/users/actions";
import { selectUserExists, selectUserLikedIds, selectUserLikedPostsEnd } from "../../redux/users/selectors";
import { Post } from "../../types";
import { UserPostSkeleton } from "../user-post/UserPostSkeleton";
import { ProfilePost } from './ProfilePost';
import { useTranslation } from 'next-i18next';
import { RequestFinished, useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useQueryId } from '../../hooks/useQueryId';
import { useDispatch } from 'react-redux';

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 10;
export const LikedPosts = () => {
    const { t } = useTranslation('user');
    const dispatch = useDispatch();
    const userId = useQueryId('userId');
    const userExists = useAppSelector(state => selectUserExists(state, userId));
    const postIds = useAppSelector(state => selectUserLikedIds(state, userId));
    const reachedEnd = useAppSelector(state => selectUserLikedPostsEnd(state, userId));

    // Fetching posts on mount and scroll
    const onRequestFinished: RequestFinished<Post[]> = (posts, reachedEnd) => {
        if(reachedEnd) {
            dispatch(setUserReachedEnd(userId, 'likedIds'));
        }
        dispatch(setPosts(posts));
        dispatch(addUserLikedIds(userId, posts.map(post => post.id)))
    }
    const { loading } = useInfiniteScroll(
        `/users/${userId}/likes?amount=${FETCH_AMOUNT}&start_at=${postIds?.length || 0}`,
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