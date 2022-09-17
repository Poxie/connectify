import styles from '../../styles/User.module.scss';
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store";
import { setUserLikedIds, setUserPostIds } from "../../redux/users/actions";
import { selectUserExists, selectUserHasLoadedLikedPosts, selectUserLikedIds } from "../../redux/users/selectors";
import { Post } from "../../types";
import { UserPostSkeleton } from "../user-post/UserPostSkeleton";
import { ProfilePost } from './ProfilePost';

export const LikedPosts = () => {
    const { get } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const userExists = useAppSelector(state => selectUserExists(state, parseInt(userId)));
    const postIds = useAppSelector(state => selectUserLikedIds(state, parseInt(userId)));
    const userHasLoadedPosts = useAppSelector(state => selectUserHasLoadedLikedPosts(state, parseInt(userId)));

    // Fetching user posts
    useEffect(() => {
        if(!userId || !userExists || userHasLoadedPosts) return;

        get(`/users/${userId}/likes`)
            .then((posts: Post[]) => {
                dispatch(setPosts(posts));
                dispatch(setUserLikedIds(parseInt(userId), posts.map(post => post.id)))
            })
    }, [userId, userExists, userHasLoadedPosts]);

    // Returning while user posts are loading
    if(!postIds) return(
        <div className={styles['posts']}>
            {Array.from(Array(4)).map((_, key) => (
                <UserPostSkeleton key={key} />
            ))}
        </div>
    );

    return(
        <div className={styles['posts']}>
            {postIds.length === 0 && (
                <span className={styles['empty']}>
                    User has not liked any posts.
                </span>
            )}

            {postIds.map(id => (
                <ProfilePost 
                    postId={id}
                    key={id}
                />
            ))}
        </div>
    )
}