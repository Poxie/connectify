import styles from '../../styles/Post.module.scss';

export const PostMainSkeleton = () => {
    return(
        <div className={styles['skeleton']} aria-hidden="true">
            <div className={styles['skeleton-header']}>
                <div className={styles['skeleton-avatar']} />
                <div className={styles['skeleton-author']} />
                <div className={styles['skeleton-timestamp']} />
            </div>
            <div className={styles['skeleton-title']}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
            <div className={styles['skeleton-content']}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
            <div className={styles['skeleton-footer']}>
                <div className={styles['skeleton-footer-button']} />
                <div className={styles['skeleton-footer-button']} />
            </div>
        </div>
    )
}