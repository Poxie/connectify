import { useRouter } from 'next/router';
import { selectChannelById } from '../../redux/messages/hooks';
import { useAppSelector } from '../../redux/store';
import styles from '../../styles/Messages.module.scss';
import { MessageInput } from "./MessageInput"
import { Messages } from "./Messages"
import { MessagesHeader } from './MessagesHeader';

export const MessagesPage = () => {
    const { channelId } = useRouter().query as { channelId: string };
    const channel = useAppSelector(state => selectChannelById(state, parseInt(channelId)));

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