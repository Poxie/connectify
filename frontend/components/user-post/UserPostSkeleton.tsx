import styles from './UserPost.module.scss';

export const UserPostSkeleton = () => {
    return(
        <div className={styles['skeleton']}>
            <div className={styles['skeleton-flex']}>
                <div className={styles['skeleton-name']} />
                <div className={styles['skeleton-timestamp']} />
            </div>
            <div className={styles['skeleton-content']} />
            <div className={styles['skeleton-footer']}>
                <div className={styles['skeleton-footer-button']} />
            </div>
        </div>
    )
}