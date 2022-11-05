import styles from '../../styles/Post.module.scss';
import { Comments } from './Comments';
import { PostMain } from './PostMain';

export const Post = () => {
    return(
        <div className={styles['container']}>
            <PostMain />
            <Comments />
        </div>
    )
}