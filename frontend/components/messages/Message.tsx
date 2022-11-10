import React from 'react';
import styles from '../../styles/Messages.module.scss';
import { useAppSelector } from "../../redux/store";
import { useAuth } from '../../contexts/auth/AuthProvider';
import { MessageAuthor } from './MessageAuthor';
import { MessageFooter } from './MessageFooter';
import { MessageContent } from './MessageContent';
import { selectMessageById } from '../../redux/messages/selectors';

const MINUTES_BETWEEN_MESSAGES = 6
const SECONDS_IN_A_MINUTE = 60;
export const Message = React.memo<{
    id: number;
    prevId: number | undefined;
    nextId: number | undefined;
    channelId: number;
}>(({ id, prevId, nextId, channelId }) => {
    const { profile } = useAuth();
    const message = useAppSelector(state => selectMessageById(state, channelId, id));
    const prevMessage = useAppSelector(state => selectMessageById(state, channelId, prevId as number));
    const nextMessage = useAppSelector(state => selectMessageById(state, channelId, nextId as number));
    const isMyMessage = profile?.id === message?.author_id;
    
    if(!message) return null;

    // Checking if current message should have author and footer
    const hasAuthor = prevMessage?.author_id !== message.author_id;
    const hasFooter = (
        nextMessage?.author_id !== message.author_id || 
        // If time between messages are 6 mins or longer, add timestamp
        (nextMessage?.timestamp || 0) - message.timestamp > SECONDS_IN_A_MINUTE * MINUTES_BETWEEN_MESSAGES
    )

    // Checking if message failed
    const failed = message.failed;

    const className = [
        styles['message'],
        isMyMessage ? styles['my-message'] : '',
        failed ? styles['failed'] : '',
        hasFooter ? styles['has-footer'] : ''
    ].join(' ');
    return(
        <div className={className}>
            {!isMyMessage && hasAuthor && (
                <MessageAuthor author={message.author} />
            )}

            <div className={styles['message-main']}>
                <MessageContent content={message.content} />
                
                {hasFooter && (
                    <div className={styles['message-footer']}>
                        {message.loading && !failed && (
                            <span>
                                Sending...
                            </span>
                        )}
                        {failed && (
                            <span>
                                Failed to send.
                            </span>
                        )}
                        {!message.loading && (
                            <MessageFooter timestamp={message.timestamp} />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
});