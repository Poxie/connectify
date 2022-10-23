import styles from './MessagesLayout.module.scss';

export const MessageSidebarChannelLoading = () => {
    const className = [
        styles['tab'],
        styles['loading']
    ].join(' ');
    return(
        <div className={className}>
            <div className={styles['main']}>
                <div className={styles['tab-avatar']} />
                <div className={styles['text-main']}>
                    <div className={styles['loading-top-text']} />
                    <div className={styles['loading-bottom-text']} />
                </div>
            </div>
        </div>
    )
}