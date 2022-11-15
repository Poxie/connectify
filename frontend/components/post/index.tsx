import { useQueryId } from '../../hooks/useQueryId';
import styles from '../../styles/Post.module.scss';
import { Comments } from './Comments';
import { PostMain } from './PostMain';

export const Post = () => {
    const postId = useQueryId('postId');
    return(
        <div className={styles['container']}>
            <PostMain postId={postId} />
            <Comments postId={postId} />
        </div>
    )
}