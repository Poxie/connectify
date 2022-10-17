import styles from './MessagesLayout.module.scss';
import { useAuth } from "../../contexts/auth/AuthProvider";
import { selectChannelLastMessage, selectChannelTyping } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { MessagesSidebarTyping } from './MessageSidebarTyping';

export const ChannelBottom: React.FC<{
    channelId: number;
}> = ({ channelId }) => {
    const { profile } = useAuth();
    const typing = useAppSelector(state => selectChannelTyping(state, channelId));
    const lastMessage = useAppSelector(state => selectChannelLastMessage(state, channelId));

    return(
        <div className={styles['tab-text-bottom']}>
            {lastMessage && !typing && (
                <span className={styles['last-message']}>
                    {lastMessage.author_id === profile?.id && (
                        'You: '
                    )}
                    {lastMessage?.content}
                </span>
            )}

            {typing !== undefined && typing !== 0 && (
                <MessagesSidebarTyping />
            )}
        </div>
    )
}