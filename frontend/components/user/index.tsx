import styles from '../../styles/User.module.scss';
import { useRouter } from "next/router"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store"
import { setUserPostIds } from "../../redux/users/actions";
import { selectUserExists, selectUserHasLoadedPosts, selectUserPostIds } from "../../redux/users/selectors";
import { Post } from "../../types";
import { ProfilePost } from "./ProfilePost";
import { UserPostSkeleton } from '../user-post/UserPostSkeleton';

export const UserProfile = () => {
    const { get } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const userExists = useAppSelector(state => selectUserExists(state, parseInt(userId)));
    const postIds = useAppSelector(state => selectUserPostIds(state, parseInt(userId)));
    const userHasLoadedPosts = useAppSelector(state => selectUserHasLoadedPosts(state, parseInt(userId)));

    // Fetching user posts
    useEffect(() => {
        if(!userId || !userExists || userHasLoadedPosts) return;

        get(`/users/${userId}/posts`)
            .then((posts: Post[]) => {
                dispatch(setPosts(posts));
                dispatch(setUserPostIds(parseInt(userId), posts.map(post => post.id)))
            })
    }, [userId, userExists, userHasLoadedPosts]);

    // Returning while user posts are loading
    if(!postIds) return(
        <div className={styles['posts']}>
            {Array.from(Array(4)).map((_, key) => (
                <UserPostSkeleton />
            ))}
        </div>
    );

    return(
        <div className={styles['posts']}>
            {postIds.map(postId => (
                <ProfilePost 
                    postId={postId}
                    key={postId}
                />
            ))}
        </div>
    )
}