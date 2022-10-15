import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useSocket } from '../../contexts/socket/SocketProvider';
import { addMessage, setMessageFailed } from '../../redux/messages/actions';
import styles from '../../styles/Messages.module.scss';
import { Message, User } from '../../types';
import Button from '../button';
import { Input } from "../input"

export const MessageInput: React.FC<{
    channelName: string;
    channelId: number;
    recipientId: number;
}> = ({ channelName, channelId, recipientId }) => {
    const { post, profile } = useAuth();
    const { socket } = useSocket();
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const sendTypingEvent = useRef(true);

    // Sending message
    const send = () => {
        if(!content) return;

        // Clearing input
        setContent('');

        // Updating message store with temporary message
        const tempId = Math.random();
        dispatch(addMessage(channelId, {
            ...{
                content,
                author: profile as User,
                author_id: profile?.id as number,
                id: tempId,
                channel_id: channelId,
                timestamp: Date.now() / 1000
            },
            loading: true
        }));

        // Creating message
        post(`/channels/${channelId}/messages`, {
            content
        })
        .then(message => {
            // Sending websocket message
            socket?.emit('direct_message', ({
                ...message,
                recipient_id: recipientId,
                tempId,
            }));
        })
        .catch(error => {
            // Updating temp message with failed attribute
            dispatch(setMessageFailed(channelId, tempId));
        })
    }

    // Handling input chane
    const onChange = (text: string) => {
        // Sending typing indicator
        if(sendTypingEvent.current) {
            socket?.emit('channel_typing', ({
                recipient_id: recipientId,
                channel_id: channelId
            }))
            
            // Making sure not to spam typing events
            sendTypingEvent.current = false;
            setTimeout(() => {
                sendTypingEvent.current = true;
            }, 3000);
        }

        // Updating content
        setContent(text);
    }

    return(
        <div className={styles['input-container']}>
            <Input 
                placeholder={`Message ${channelName}`}
                inputClassName={styles['input']}
                onChange={onChange}
                defaultValue={content}
                focusOnMount={true}
                onSubmit={send}
            />
            <Button 
                className={styles['input-button']}
                onClick={send}
            >
                Send
            </Button>
        </div>
    )
}