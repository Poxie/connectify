import styles from '../../styles/Messages.module.scss';
import { selectMessageById } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { useAuth } from '../../contexts/auth/AuthProvider';
import { MessageAuthor } from './MessageAuthor';

export const Message: React.FC<{
    id: number;
    prevId: number | undefined;
    channelId: number;
}> = ({ id, prevId, channelId }) => {
    const { profile } = useAuth();
    const message = useAppSelector(state => selectMessageById(state, channelId, id));
    const prevMessage = useAppSelector(state => selectMessageById(state, channelId, prevId as number));
    const isMyMessage = profile?.id === message?.author_id;
    
    if(!message) return null;

    // Checking if current message should have author
    const hasAuthor = prevMessage?.author_id !== message.author_id;

    const className = [
        styles['message'],
        isMyMessage ? styles['my-message'] : ''
    ].join(' ');
    return(
        <div className={className}>
            {!isMyMessage && hasAuthor && (
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