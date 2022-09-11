import styles from '../../../styles/Feed.module.scss';
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth/AuthProvider";
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { selectFeedPostIds } from '../../../redux/feed/hooks';
import { FeedPost } from './FeedPost';
import { UserPostSkeleton } from '../../user-post/UserPostSkeleton';
import { AnimatePresence } from 'framer-motion';
import { setPosts } from '../../../redux/posts/actions';
import { setFeedPostIds } from '../../../redux/feed/actions';
import { Post } from '../../../types';

export const Feed = () => {
    const { get, loading } = useAuth();
    const dispatch = useAppDispatch();
    const postIds = useAppSelector(selectFeedPostIds);

    // Initial fetch for feed posts 
    useEffect(() => {
        if(loading || postIds.length) return;

        get(`/feed`)
            .then((posts: Post[]) => {
                dispatch(setFeedPostIds(posts.map(post => post.id)));
                dispatch(setPosts(posts));
            })
    }, [get, loading]);

    return(
        <div className={styles['container']}>
            <AnimatePresence>
                {loading && postIds.length === 0 && Array.from(Array(4)).map((_, key) => (
                    <UserPostSkeleton 
                        key={key}
                    />
                ))}
            </AnimatePresence>

            <AnimatePresence>
                {postIds.map(id => <FeedPost id={id} key={id} />)}
            </AnimatePresence>
        </div>
    )
}