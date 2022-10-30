import styles from '../../../styles/Feed.module.scss';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/auth/AuthProvider";
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { FeedPost } from './FeedPost';
import { UserPostSkeleton } from '../../user-post/UserPostSkeleton';
import { AnimatePresence } from 'framer-motion';
import { setPosts } from '../../../redux/posts/actions';
import { addFeedPostIds, setFeedPostIds, setFeedReachedEnd } from '../../../redux/feed/actions';
import { Post } from '../../../types';
import { LoginPrompt } from '../../login-prompt/LoginPrompt';
import { useTranslation } from 'next-i18next';
import { EmptyPrompt } from '../../empty-prompt/EmptyPrompt';
import { selectFeedPostIds, selectFeedReachedEnd } from '../../../redux/feed/selectors';
import { ScrollCallback, useInfiniteScroll } from '../../../hooks/useInfiniteScroll';

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 10;
const PLACEHOLDER_AMOUNT = 4;
export const Feed = () => {
    const { t } = useTranslation('home');
    const { token, loading } = useAuth();
    const dispatch = useAppDispatch();
    const postIds = useAppSelector(selectFeedPostIds);
    const reachedEnd = useAppSelector(selectFeedReachedEnd);

    // Fetching feed post on mount and scroll
    const scrollCallback: ScrollCallback = useCallback((posts: Post[], reachedEnd) => {
        if(reachedEnd) {
            dispatch(setFeedReachedEnd(true));
        }
        dispatch(setPosts(posts));
        dispatch(addFeedPostIds(posts.map(post => post.id)));
    }, []);
    const { loading: feedLoading } = useInfiniteScroll<Post[]>(
        `/feed?amount=${FETCH_AMOUNT}&start_at=${postIds.length}`,
        scrollCallback,
        {
            threshold: SCROLL_THRESHOLD,
            fetchAmount: FETCH_AMOUNT,
            fetchOnMount: postIds.length === 0,
            isAtEnd: reachedEnd
        }
    )

    return(
        <div className={styles['container']}>
            <AnimatePresence>
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

            {feedLoading && Array.from(Array(PLACEHOLDER_AMOUNT)).map((_, key) => (
                <UserPostSkeleton 
                    key={key}
                />
            ))}

            {reachedEnd && (
                <span className={styles['end']}>
                    {t('reachedEnd')}
                </span>
            )}
        </div>
    )
}