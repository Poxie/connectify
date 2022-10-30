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

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 10;
export const LikedPosts = () => {
    const { t } = useTranslation('user');
    const { get } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const userExists = useAppSelector(state => selectUserExists(state, parseInt(userId)));
    const postIds = useAppSelector(state => selectUserLikedIds(state, parseInt(userId)));
    const userHasReachedEnd = useAppSelector(state => selectUserLikedPostsEnd(state, parseInt(userId)));
    const userHasLoadedPosts = useAppSelector(state => selectUserHasLoadedLikedPosts(state, parseInt(userId)));
    const fetching = useRef(false);

    // Function to fetch user posts
    const fetchUserPosts = useCallback(async (amount=FETCH_AMOUNT, startAt=0) => {
        const posts = await get<Post[]>(`/users/${userId}/likes?amount=${amount}&start_at=${startAt}`);
        return posts;
    }, [get, userId]);

    // Fetching user posts
    useEffect(() => {
        if(!userId || !userExists || userHasLoadedPosts || fetching.current) return;

        fetching.current = true;
        fetchUserPosts()
            .then(posts => {
                dispatch(setPosts(posts));
                dispatch(setUserLikedIds(parseInt(userId), posts.map(post => post.id)))
                
                // Checking if user reached end
                if(posts.length < FETCH_AMOUNT) {
                    dispatch(setUserReachedEnd(parseInt(userId), 'likedIds'));
                } else {
                    fetching.current = false;
                }
            })
    }, [userId, userExists, userHasLoadedPosts]);

    // Loading more posts on scroll
    useEffect(() => {
        if(userHasReachedEnd) return;

        const onScroll = () => {
            if(fetching.current || !postIds?.length) return;

            const diffFromBottom = Math.abs(window.scrollY + window.innerHeight - document.body.offsetHeight);
            
            if(diffFromBottom < SCROLL_THRESHOLD) {
                fetching.current = true;

                fetchUserPosts(FETCH_AMOUNT, postIds.length)
                    .then(posts => {
                        // If less than desired is fetched
                        if(!postIds.length || posts.length < FETCH_AMOUNT) {
                            dispatch(setUserReachedEnd(parseInt(userId), 'likedIds'));
                            window.removeEventListener('scroll', onScroll);
                        }
                        if(!postIds.length) return;

                        // If posts are returned, push them
                        dispatch(setPosts(posts));
                        dispatch(addUserLikedIds(parseInt(userId), posts.map(post => post.id)))
                        if(posts.length === FETCH_AMOUNT) fetching.current = false;
                    })
            }
        }

        // Setting up event listeners
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [postIds?.length, userId, userHasReachedEnd]);

    // Returning while user posts are loading
    if(!postIds) return(
        <div className={styles['post-container']}>
            {Array.from(Array(2)).map((_, key) => (
                <UserPostSkeleton key={key} />
            ))}
        </div>
    );

    return(
        <>
            {postIds.length === 0 && (
                <span className={styles['empty']}>
                    {t('noLikedPosts')}
                </span>
            )}

            {postIds.length !== 0 && (
                <ul className={styles['post-container']}>
                    {postIds.map(id => (
                        <ProfilePost 
                            postId={id}
                            key={id}
                        />
                    ))}
                </ul>
            )}

            {userHasReachedEnd && (
                <span className={styles['end']}>
                    {t('likedReachedEnd')}
                </span>
            )}
        </>
    )
}