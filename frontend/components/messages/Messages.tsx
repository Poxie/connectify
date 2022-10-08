import styles from '../../styles/Messages.module.scss';
import { useRouter } from "next/router"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setMessages } from "../../redux/messages/actions";
import { selectMessageIds } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { Message } from "./Message";

export const Messages: React.FC<{
    channelId: number;
}> = ({ channelId }) => {
    const dispatch = useDispatch();
    const { get, loading } = useAuth();
    const messageIds = useAppSelector(state => selectMessageIds(state, channelId));

    // Fetching channel messages
    useEffect(() => {
        // Making sure not to make unnecessary requests
        if(messageIds || loading) return;

        // Getting messages
        get(`/channels/${channelId}/messages`)
            .then(messages => {
                dispatch(setMessages(channelId, messages));
            })
    }, [channelId, messageIds, get, loading]);

    if(!messageIds) return null;

    return(
        <ul className={styles['list']}>
            {messageIds.map(id => (
                <Message 
                    id={id}
                    channelId={channelId}
                    key={id}
                />
            ))}
        </ul>
    )
}