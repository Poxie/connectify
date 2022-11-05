import styles from '../../styles/Post.module.scss';

export const CommentInputSkeleton = () => {
    return(
        <div className={styles['add-comment']} aria-hidden="true">
            <div className={styles['skeleton-comment-count']} />
            <div className={styles['skeleton-comment-input']} />
        </div>
    )
}