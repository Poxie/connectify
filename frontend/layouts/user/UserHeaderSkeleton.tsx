import styles from '../../styles/User.module.scss';

export const UserHeaderSkeleton = () => {
    return(
        <div className={styles['header']}>
            <div className={styles['header-banner']} />
            <div className={styles['header-content']}>
                <div className={styles['header-main']}>
                    <div className={styles['header-avatar']} />
                    <div className={styles['header-text']}>
                        <div className={styles['header-name-skeleton']} />
                        <div className={styles['header-subtext-skeleton']} />
                    </div>
                </div>
                <div className={styles['header-buttons']}>
                    <div className={styles['header-button-skeleton']} />
                </div>
            </div>
        </div>
    )
}