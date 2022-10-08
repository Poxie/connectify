import styles from '../../styles/Messages.module.scss';
import { selectMessageById } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { useAuth } from '../../contexts/auth/AuthProvider';
import { MessageAuthor } from './MessageAuthor';

export const Message: React.FC<{
    id: number;
    channelId: number;
}> = ({ id, channelId }) => {
    const { profile } = useAuth();
    const message = useAppSelector(state => selectMessageById(state, channelId, id));
    const isMyMessage = profile?.id === message?.author_id;
    
    if(!message) return null;

    const className = [
        styles['message'],
        isMyMessage ? styles['my-message'] : ''
    ].join(' ');
    return(
        <div className={className}>
            {!isMyMessage && (
                <MessageAuthor author={message.author} />
            )}

            <div className={styles['message-content']}>
                <span>
                    {message?.content}
                </span>
            </div>
        </div>
    )
}