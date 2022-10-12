import { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useSocket } from '../../contexts/socket/SocketProvider';
import styles from '../../styles/Messages.module.scss';
import Button from '../button';
import { Input } from "../input"

export const MessageInput: React.FC<{
    channelName: string;
    channelId: number;
    recipientId: number;
}> = ({ channelName, channelId, recipientId }) => {
    const { post, profile } = useAuth();
    const { socket } = useSocket();
    const [content, setContent] = useState('');

    const send = () => {
        if(!content) return;

        // Creating message
        post(`/channels/${channelId}/messages`, {
            content
        })
        .then(message => {
            setContent('');

            // Sending websocket message
            socket?.emit('direct_message', ({
                ...message,
                recipient_id: recipientId
            }));
        })
    }

    return(
        <div className={styles['input-container']}>
            <Input 
                placeholder={`Message ${channelName}`}
                inputClassName={styles['input']}
                onChange={setContent}
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