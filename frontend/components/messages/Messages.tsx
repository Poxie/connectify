import styles from '../../styles/Messages.module.scss';
import { useEffect, useLayoutEffect, useRef } from "react";
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
    const list = useRef<HTMLUListElement>(null);

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

    // Scrolling to bottom on render
    useEffect(() => {
        if(!list.current) return;
        list.current.scrollTo({ top: list.current.offsetHeight });
    }, [list, messageIds?.length]);

    if(!messageIds) return null;

    return(
        <div className={styles['list-container']}>
            <ul className={styles['list']} ref={list}>
                {messageIds.map(id => (
                    <Message 
                        id={id}
                        channelId={channelId}
                        key={id}
                    />
                ))}
            </ul>
        </div>
    )
}