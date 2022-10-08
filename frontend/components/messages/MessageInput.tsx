import { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';
import styles from '../../styles/Messages.module.scss';
import Button from '../button';
import { Input } from "../input"

export const MessageInput: React.FC<{
    channelName: string;
    channelId: number;
}> = ({ channelName, channelId }) => {
    const { post } = useAuth();
    const [content, setContent] = useState('');

    const send = () => {
        if(!content) return;

        post(`/channels/${channelId}/messages`, {
            content
        })
        .then(message => {
            setContent('');
        })
    }

    return(
        <div className={styles['input-container']}>
            <Input 
                placeholder={`Message ${channelName}`}
                inputClassName={styles['input']}
                onChange={setContent}
                defaultValue={content}
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