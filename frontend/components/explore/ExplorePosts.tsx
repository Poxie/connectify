import styles from '../../styles/Explore.module.scss';
import { useDispatch } from "react-redux";
import { RequestFinished, useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { setExploreLatestIds, setExploreTopIds } from "../../redux/explore/actions";
import { selectExploreFilter, selectExplorePostIds } from "../../redux/explore/selectors"
import { setPosts } from "../../redux/posts/actions";
import { useAppSelector } from "../../redux/store"
import { Post } from "../../types";
import { UserPost } from "../user-post";
import { UserPostSkeleton } from '../user-post/UserPostSkeleton';
import { useTranslation } from 'next-i18next';

const FETCH_AMOUNT = 15;
const SCROLL_THRESHOLD = 400;
const PLACEHOLDER_AMOUNT = 4;
export const ExplorePosts = () => {
    const { t } = useTranslation('home');
    const dispatch = useDispatch();
    const postIds = useAppSelector(selectExplorePostIds);
    const filterType = useAppSelector(selectExploreFilter);

    // Fetching posts on mount and scroll
    const onRequestFinished: RequestFinished<Post[]> = (posts, reachedEnd) => {
        // Preventing duplicate posts
        const filteredPosts = posts.filter(post => !postIds.includes(post.id));

        const action = filterType === 'top' ? setExploreTopIds : setExploreLatestIds;
        dispatch(action(filteredPosts.map(post => post.id)));
        dispatch(setPosts(filteredPosts));
    }
    const { loading, reachedEnd } = useInfiniteScroll(
        `/explore?type=${filterType}&start_at=${postIds.length}&amount=${FETCH_AMOUNT}`,
        onRequestFinished,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            fetchOnMount: !postIds.length,
            identifier: `explore-${filterType}`
        }
    )

    return(
        <>
        <ul className={styles['post-container']}>
            {postIds.map(id => (
                <UserPost 
                    id={id}
                    key={id}
                />
            ))}
            
            {loading && (
                Array.from(Array(PLACEHOLDER_AMOUNT)).map((_, key) => (
                    <UserPostSkeleton key={key} />
                ))
            )}
        </ul>

        
        {reachedEnd && (
            <span className={styles['reached-end']}>
                {t('explore.reachedEnd')}
            </span>
        )}
        </>
    )
}