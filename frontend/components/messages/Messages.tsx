import styles from '../../styles/Messages.module.scss';
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { removeUnreadCount, setMessages } from "../../redux/messages/actions";
import { selectChannelUnreadCount, selectMessageIds } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { Message } from "./Message";
import { User } from '../../types';
import Link from 'next/link';

export const Messages: React.FC<{
    channelId: number;
    recipient: User;
}> = ({ channelId, recipient }) => {
    const dispatch = useDispatch();
    const { get, patch, loading } = useAuth();
    const messageIds = useAppSelector(state => selectMessageIds(state, channelId));
    const unreadCount = useAppSelector(state => selectChannelUnreadCount(state, channelId));
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

    // Resetting unread count
    useEffect(() => {
        if(!unreadCount) return;

        patch(`/channels/${channelId}/unread`, {
            unread_count: 0
        })
            .then(result => {
                dispatch(removeUnreadCount(channelId));
            })
    }, [unreadCount, channelId, patch]);

    // Scrolling to bottom on render
    useEffect(() => {
        if(!list.current) return;
        list.current.scrollTo({ top: list.current.scrollHeight });
    }, [list, messageIds?.length]);

    return(
        <div className={styles['list-container']}>
            <ul className={styles['list']} ref={list}>
                {messageIds && !messageIds?.length && (
                    <span>
                        You don't have any messages with 
                        {' '}
                        <Link href={`/users/${recipient.id}`}>
                            <a>
                                <strong>{recipient.display_name || recipient.username}</strong>
                            </a>
                        </Link>
                        {' '}
                        yet.
                    </span>
                )}
                {messageIds && messageIds.map(id => (
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