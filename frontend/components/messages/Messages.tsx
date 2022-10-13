import styles from '../../styles/Messages.module.scss';
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { prependMessages, removeUnreadCount, setLastChannelId, setMessages } from "../../redux/messages/actions";
import { selectChannelUnreadCount, selectLastChannelId, selectMessageIds } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { Message } from "./Message";
import { User } from '../../types';
import Link from 'next/link';

const UPDATE_SCROLL_THRESHOLD = 400;
const MESSAGES_TO_LOAD = 50;
export const Messages: React.FC<{
    channelId: number;
    recipient: User;
}> = ({ channelId, recipient }) => {
    const dispatch = useDispatch();
    const { get, patch, loading } = useAuth();
    const messageIds = useAppSelector(state => selectMessageIds(state, channelId));
    const unreadCount = useAppSelector(state => selectChannelUnreadCount(state, channelId));
    const lastChannelId = useAppSelector(selectLastChannelId);
    const list = useRef<HTMLUListElement>(null);
    const loadingMore = useRef(false);

    // Function to fetch messages
    const fetchMessages = useCallback(async (amount=MESSAGES_TO_LOAD, startAt=0) => {
        const messages = await get(`/channels/${channelId}/messages?amount=${amount}&start_at=${startAt}`);
        return messages;
    }, [channelId]);

    // Fetching channel messages
    useEffect(() => {
        // Making sure not to make unnecessary requests
        if(messageIds || loading) return;

        // Getting messages
        fetchMessages().then(messages => {
            dispatch(setMessages(channelId, messages));
        })
    }, [channelId, messageIds, get, loading]);

    // Fetching more messages on scroll
    useEffect(() => {
        if(!messageIds?.length) return;

        // Listening to message list scroll
        const onScroll = async () => {
            if(!list.current) return;

            // Checking if scroll meets threshold
            const scroll = list.current.scrollTop;
            if(scroll < UPDATE_SCROLL_THRESHOLD) {
                if(loadingMore.current) return;
                loadingMore.current = true;

                // Fetching and displaying new messages
                const messages = await fetchMessages(MESSAGES_TO_LOAD, messageIds.length);
                dispatch(prependMessages(channelId, messages));

                // If messages are returned, allow re-fetch on scroll
                if(messages.length) {
                    loadingMore.current = false;
                }
            }
        }

        // Handling event listeners
        list.current?.addEventListener('scroll', onScroll)
        return () => list.current?.removeEventListener('scroll', onScroll);
    }, [messageIds?.length]);

    // Updating last channelId
    useEffect(() => {
        // Checking if last channel is same channel
        if(channelId === lastChannelId) return;

        // Dispatching new channelId
        dispatch(setLastChannelId(channelId));
    }, [channelId, lastChannelId]);

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
                {messageIds && messageIds.map((id, key) => (
                    <Message 
                        id={id}
                        prevId={messageIds.slice(key - 1, key)[0]}
                        nextId={messageIds.slice(key + 1, key + 2)[0]}
                        channelId={channelId}
                        key={id}
                    />
                ))}
            </ul>
        </div>
    )
}