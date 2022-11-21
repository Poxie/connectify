import styles from '../../styles/Comments.module.scss';

export const CommentInputSkeleton = () => {
    return(
        <div className={styles['comment-input']} aria-hidden="true">
            <div className={styles['skeleton-comment-count']} />
            <div className={styles['skeleton-comment-input']} />
        </div>
    )
}