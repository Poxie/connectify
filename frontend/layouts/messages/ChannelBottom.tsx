import styles from './MessagesLayout.module.scss';
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useAppSelector } from "../../redux/store";
import { MessagesSidebarTyping } from './MessageSidebarTyping';
import { useTranslation } from 'next-i18next';
import { selectChannelLastMessage, selectChannelTyping } from '../../redux/messages/selectors';

export const ChannelBottom: React.FC<{
    channelId: number;
}> = ({ channelId }) => {
    const { t } = useTranslation('messages');
    const { profile } = useAuth();
    const typing = useAppSelector(state => selectChannelTyping(state, channelId));
    const lastMessage = useAppSelector(state => selectChannelLastMessage(state, channelId));

    return(
        <div className={styles['tab-text-bottom']}>
            {lastMessage && !typing && (
                <span className={styles['last-message']}>
                    {lastMessage.author_id === profile?.id && (
                        `${t('you')}: `
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