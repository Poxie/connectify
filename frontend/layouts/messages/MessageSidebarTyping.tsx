import styles from './MessagesLayout.module.scss';

export const MessagesSidebarTyping = () => {
    return(
        <div className={styles['typing-indicator']} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}