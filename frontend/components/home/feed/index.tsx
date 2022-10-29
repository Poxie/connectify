import styles from '../../../styles/Feed.module.scss';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/auth/AuthProvider";
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { FeedPost } from './FeedPost';
import { UserPostSkeleton } from '../../user-post/UserPostSkeleton';
import { AnimatePresence } from 'framer-motion';
import { setPosts } from '../../../redux/posts/actions';
import { addFeedPostIds, setFeedPostIds } from '../../../redux/feed/actions';
import { Post } from '../../../types';
import { LoginPrompt } from '../../login-prompt/LoginPrompt';
import { useTranslation } from 'next-i18next';
import { EmptyPrompt } from '../../empty-prompt/EmptyPrompt';
import Button from '../../button';
import { selectFeedPostIds } from '../../../redux/feed/selectors';

const SCROLL_THRESHOLD = 500;
export const Feed = () => {
    const { t } = useTranslation('home');
    const { get, token, loading } = useAuth();
    const dispatch = useAppDispatch();
    const postIds = useAppSelector(selectFeedPostIds);
    const [feedLoading, setFeedLoading] = useState(true);
    const [reachedEnd, setReachedEnd] = useState(false);
    const fetching = useRef(false);

    // Function to get feed posts
    const getFeedPosts = useCallback(async (amount=10, startAt=0) => {
        return await get(`/feed?amount=${amount}&start_at=${startAt}`) as Promise<Post[]>;
    }, [get]);

    // Initial fetch for feed posts 
    useEffect(() => {
        if(loading || postIds.length) return;
        
        // User is not logged in
        if(!token) {
            setFeedLoading(false);
            dispatch(setFeedPostIds([]));
            return
        }

        setFeedLoading(true);

        getFeedPosts()
            .then(posts => {
                dispatch(setFeedPostIds(posts.map(post => post.id)));
                dispatch(setPosts(posts));
                setFeedLoading(false);
            })
    }, [get, token, loading]);

    // Loading more posts on scroll
    useEffect(() => {
        const onScroll = () => {
            if(fetching.current) return;

            const diffFromBottom = Math.abs(window.scrollY + window.innerHeight - document.body.offsetHeight);
            
            if(diffFromBottom < SCROLL_THRESHOLD) {
                fetching.current = true;

                getFeedPosts(10, postIds.length)
                    .then(posts => {
                        if(!posts.length) return setReachedEnd(true);

                        dispatch(setPosts(posts));
                        dispatch(addFeedPostIds(posts.map(post => post.id)));
                        fetching.current = false;
                    })
            }
        }

        // Setting up event listeners
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [postIds.length]);

    return(
        <div className={styles['container']}>
            <AnimatePresence>
                {loading && postIds.length === 0 && Array.from(Array(4)).map((_, key) => (
                    <UserPostSkeleton 
                        key={key}
                    />
                ))}

                {/* User logged in, but feed is empty */}
                {!feedLoading && token && postIds.length === 0 && (
                    <EmptyPrompt
                        header={t('feedEmptyHeader')}
                        message={t('feedEmptyMessage')}
                        buttons={[
                            { text: t('exploreMode'), type: 'default', path: '/home/explore' },
                            { text: t('searchMode'), type: 'secondary' }
                        ]}
                    />
                )}

                {/* User is not logged in */}
                {!loading && !token && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: .35 }}
                    >
                        <LoginPrompt />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {postIds.map(id => <FeedPost id={id} key={id} />)}
            </AnimatePresence>

            {reachedEnd && (
                <span className={styles['end']}>
                    {t('reachedEnd')}
                </span>
            )}
        </div>
    )
}