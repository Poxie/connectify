import styles from '../../styles/Post.module.scss';

export const PostCommentSkeleton = () => {
    return(
        <div className={styles['skeleton-comment']}>
            <div className={styles['skeleton-comment-header']}>
                <div className={styles['skeleton-comment-author']} />
                <div className={styles['skeleton-comment-timestamp']} />
            </div><div className={styles['skeleton-comment-content']} />
        </div>
    )
}