import styles from './PostOverlay.module.scss';
import { PostMain } from '../../components/post/PostMain';
import { Comments } from '../../components/post/Comments';

export const Main: React.FC<{
    postId: number;
}> = ({ postId }) => {
    return(
        <div className={styles['main']}>
            <PostMain />
            <Comments />
        </div>
    )
}