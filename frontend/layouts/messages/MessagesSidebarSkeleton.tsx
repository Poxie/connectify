import { MessageSidebarChannelSkeleton } from './MessageSidebarChannelSkeleton';
import styles from './MessagesLayout.module.scss';

const CHANNEL_SKELETON_COUNT = 4;
export const MessagesSidebarSkeleton = () => {
    return(
        <div className={styles['sidebar']} aria-hidden="true">
            <div className={styles['sidebar-header']}>
                <div className={styles['sidebar-header-text']} />
                <div className={styles['sidebar-header-button']} />
            </div>
            <ul className={styles['tabs']}>
                {Array.from(Array(CHANNEL_SKELETON_COUNT)).map((_, key) => (
                    <MessageSidebarChannelSkeleton key={key} />
                ))}
            </ul>
        </div>
    )
}