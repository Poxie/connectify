import styles from './MessagesLayout.module.scss';

export const MessageSidebarChannelLoading = () => {
    const className = [
        styles['tab'],
        styles['loading']
    ].join(' ');
    return(
        <div className={className}>
            <div className={styles['tab-avatar']} />
            <div className={styles['loading-text']} />
        </div>
    )
}