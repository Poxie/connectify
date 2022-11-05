import styles from './MessagesLayout.module.scss';

export const MessageSidebarChannelSkeleton = () => {
    const className = [
        styles['tab'],
        styles['loading']
    ].join(' ');
    return(
        <li className={className} aria-hidden="true">
            <div className={styles['main']}>
                <div className={styles['tab-avatar']} />
                <div className={styles['text-main']}>
                    <div className={styles['loading-top-text']} />
                    <div className={styles['loading-bottom-text']} />
                </div>
            </div>
        </li>
    )
}