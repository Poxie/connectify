import React from 'react';
import styles from '../../styles/Messages.module.scss';
import { useAppSelector } from "../../redux/store";
import { useAuth } from '../../contexts/auth/AuthProvider';
import { MessageAuthor } from './MessageAuthor';
import { MessageFooter } from './MessageFooter';
import { MessageContent } from './MessageContent';
import { selectMessageById } from '../../redux/messages/selectors';
import { MessageTimestamp } from './MessageTimestamp';
import { MessageDivider } from './MessageDivider';

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

    // Determining if previous message was sent on different day
    const prevMessageDate = new Date((prevMessage?.timestamp || message.timestamp) * 1000);
    const nowMessageDate = new Date(message.timestamp * 1000);
    const isSameDay = prevMessageDate.toDateString() === nowMessageDate.toDateString();

    // Checking if current message should have author and footer
    const hasAuthor = (
        // If previous message is other author
        prevMessage?.author_id !== message.author_id ||
        // If previous message was sent on different day
        !isSameDay
    )
    const hasFooter = (
        nextMessage?.author_id !== message.author_id || 
        // If time between messages are 6 mins or longer, add timestamp
        (nextMessage?.timestamp || 0) - message.timestamp > SECONDS_IN_A_MINUTE * MINUTES_BETWEEN_MESSAGES
    )

    const className = [
        styles['message'],
        isMyMessage ? styles['my-message'] : '',
        message.failed ? styles['failed'] : '',
        hasFooter ? styles['has-footer'] : ''
    ].join(' ');
    return(
        <>
        {!isSameDay && (
            <MessageDivider 
                timestamp={message.timestamp}
            />
        )}

        <div className={className}>
            {!isMyMessage && hasAuthor && (
                <MessageAuthor author={message.author} />
            )}

            <div className={styles['message-main']}>
                <MessageContent content={message.content} />
                
                {hasFooter && (
                    <MessageFooter 
                        loading={message.loading}
                        failed={message.failed}
                        timestamp={message.timestamp}
                    />
                )}
            </div>
        </div>
        </>
    )
});
Message.displayName = 'Message';