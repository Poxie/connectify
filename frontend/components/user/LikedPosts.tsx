import styles from '../../styles/User.module.scss';
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store";
import { setUserLikedIds, setUserPostIds } from "../../redux/users/actions";
import { selectUserExists, selectUserHasLoadedLikedPosts, selectUserLikedIds } from "../../redux/users/selectors";
import { Post } from "../../types";
import { UserPostSkeleton } from "../user-post/UserPostSkeleton";
import { ProfilePost } from './ProfilePost';
import { useTranslation } from 'next-i18next';

export const LikedPosts = () => {
    const { t } = useTranslation('user');
    const { get } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const userExists = useAppSelector(state => selectUserExists(state, parseInt(userId)));
    const postIds = useAppSelector(state => selectUserLikedIds(state, parseInt(userId)));
    const userHasLoadedPosts = useAppSelector(state => selectUserHasLoadedLikedPosts(state, parseInt(userId)));
    const fetching = useRef(false);

    // Fetching user posts
    useEffect(() => {
        if(!userId || !userExists || userHasLoadedPosts || fetching.current) return;

        fetching.current = true;
        get(`/users/${userId}/likes`)
            .then((posts: Post[]) => {
                dispatch(setPosts(posts));
                dispatch(setUserLikedIds(parseInt(userId), posts.map(post => post.id)))
                fetching.current = false;
            })
    }, [userId, userExists, userHasLoadedPosts]);

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
        </>
    )
}