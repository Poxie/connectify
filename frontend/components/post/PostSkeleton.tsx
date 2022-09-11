import styles from '../../styles/Post.module.scss';
import { PostCommentSkeleton } from './PostCommentSkeleton';

export const PostSkeleton = () => {
    return(
        <div className={styles['skeleton']} aria-hidden="true">
            <div className={styles['skeleton-header']}>
                <div className={styles['skeleton-author']} />
                <div className={styles['skeleton-timestamp']} />
            </div>
            <div className={styles['skeleton-title']} />
            <div className={styles['skeleton-content']} />
            <div className={styles['skeleton-footer']}>
                <div className={styles['skeleton-footer-button']} />
                <div className={styles['skeleton-footer-button']} />
            </div>
            <PostCommentSkeleton />
        </div>
    )
}