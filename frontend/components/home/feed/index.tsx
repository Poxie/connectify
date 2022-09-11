import styles from '../../../styles/Feed.module.scss';
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth/AuthProvider";
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { selectFeedPostIds } from '../../../redux/feed/hooks';
import { setFeedPosts } from '../../../redux/feed/actions';
import { FeedPost } from './FeedPost';
import { UserPostSkeleton } from '../../user-post/UserPostSkeleton';
import { AnimatePresence } from 'framer-motion';

export const Feed = () => {
    const { get, loading } = useAuth();
    const dispatch = useAppDispatch();
    const postIds = useAppSelector(selectFeedPostIds);

    // Initial fetch for feed posts 
    useEffect(() => {
        if(loading || postIds.length) return;

        get(`/feed`)
            .then(posts => {
                dispatch(setFeedPosts(posts));
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

            {postIds.map(id => <FeedPost id={id} key={id} />)}
        </div>
    )
}