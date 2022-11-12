import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { selectChannelById, selectChannelsLoading } from '../../redux/messages/selectors';
import { useAppSelector } from '../../redux/store';
import styles from '../../styles/Messages.module.scss';
import { MessageInput } from "./MessageInput"
import { Messages } from "./Messages"
import { MessagesHeader } from './MessagesHeader';

export const MessagesPage = () => {
    const { t } = useTranslation('messages');
    const { channelId } = useRouter().query as { channelId: string };
    const channel = useAppSelector(state => selectChannelById(state, parseInt(channelId)));
    const channelsLoading = useAppSelector(selectChannelsLoading);

    // If user has no access, return label
    if(!channel && !channelsLoading) {
        return(
            <span className={styles['label']}>
                {t('unauthorized')}
            </span>
        )
    };
    if(!channel) return null;

    const recipient = channel.recipients[0];
    const channelName = channel.name || recipient.display_name || recipient.username;
    return(
        <div className={styles['container']}>
            <MessagesHeader 
                recipient={recipient}
            />
            <Messages 
                channelId={parseInt(channelId)}
                recipient={recipient}
            />
            <MessageInput 
                channelName={channelName}
                channelId={parseInt(channelId)}
                recipientId={recipient.id}
            />
        </div>
    )
}