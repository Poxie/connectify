import styles from '../../styles/Messages.module.scss';
import { MessageTimestamp } from "./MessageTimestamp";

export const MessageFooter: React.FC<{
    loading: boolean | undefined;
    failed: boolean | undefined;
    timestamp: number;
}> = ({ loading, failed, timestamp }) => {
    return(
        <div className={styles['message-footer']}>
            {loading && !failed && (
                <span>
                    Sending...
                </span>
            )}
            {failed && (
                <span>
                    Failed to send.
                </span>
            )}
            {!loading && (
                <MessageTimestamp timestamp={timestamp} />
            )}
        </div>
    )
}