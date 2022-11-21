import styles from './PostOverlay.module.scss';
import { PostMain } from '../../components/post/PostMain';
import { useRef } from 'react';
import { Comments } from '../../components/comments';

export const Main: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const ref = useRef<HTMLDivElement>(null);

    return(
        <div className={styles['main']} ref={ref}>
            <PostMain postId={postId} />
            <Comments postId={postId} containerRef={ref} />
        </div>
    )
}