import styles from '../../styles/Messages.module.scss';
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { prependMessages, removeUnreadCount, setChannelReachedEnd, setLastChannelId, setMessages } from "../../redux/messages/actions";
import { useAppSelector } from "../../redux/store";
import { Message } from "./Message";
import { Message as MessageType, User } from '../../types';
import Link from 'next/link';
import { Loader } from '../loader';
import { selectChannelReachedEnd, selectChannelUnreadCount, selectLastChannelId, selectMessageIds } from '../../redux/messages/selectors';
import { RequestFinished, useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useTranslation } from 'next-i18next';

const PREVENT_AUTO_SCROLL_THRESHOLD = 200;
const UPDATE_SCROLL_THRESHOLD = 600;
const MESSAGES_TO_LOAD = 50;
export const Messages: React.FC<{
    channelId: number;
    recipient: User;
}> = ({ channelId, recipient }) => {
    const { t } = useTranslation('messages');
    const { patch } = useAuth();
    const dispatch = useDispatch();
    const messageIds = useAppSelector(state => selectMessageIds(state, channelId));
    const unreadCount = useAppSelector(state => selectChannelUnreadCount(state, channelId));
    const reachedEnd = useAppSelector(state => selectChannelReachedEnd(state, channelId))
    const lastChannelId = useAppSelector(selectLastChannelId);
    const scrollContainer = useRef<HTMLDivElement>(null);
    const list = useRef<HTMLUListElement>(null);
    const shouldScroll = useRef(messageIds === undefined);

    // Fetching messages on mount and scroll
    const onRequestFinished: RequestFinished<MessageType[]> = (messages, reachedEnd) => {
        const filteredMessages = messages.filter(message => !messageIds?.includes(message.id));
        dispatch(prependMessages(channelId, filteredMessages));

        if(reachedEnd) {
            dispatch(setChannelReachedEnd(channelId, true));
        }
    }
    const { loading } = useInfiniteScroll(
        `/channels/${channelId}/messages?amount=${MESSAGES_TO_LOAD}&start_at=${messageIds?.length || 0}`,
        onRequestFinished,
        {
            fetchAmount: MESSAGES_TO_LOAD,
            threshold: UPDATE_SCROLL_THRESHOLD,
            fetchOnMount: !messageIds,
            direction: 'up',
            scrollContainer,
            identifier: channelId,
            isAtEnd: reachedEnd
        }
    )

    // Updating last channelId
    useEffect(() => {
        // On channel change, scroll to bottom
        shouldScroll.current = true;

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

    // Scrolling to bottom
    const scrollToBottom = useCallback(() => {
        if(!list.current || !scrollContainer.current) return;
        scrollContainer.current.scrollTo({ top: list.current.clientHeight })
    }, [list, scrollContainer]);

    // Scrolling to bottom on render or new messages
    useEffect(() => {
        if(!scrollContainer.current || !list.current) return;

        // Scrolling to bottom on render
        if(messageIds && shouldScroll.current) {
            shouldScroll.current = false;
            return scrollToBottom();
        }
        
        // Getting scroll from bottom
        const { scrollHeight, scrollTop, clientHeight } = scrollContainer.current;
        const scrollFromBottom = scrollHeight - scrollTop - clientHeight;
        
        // Checking if scroll is within scroll threshold
        if(scrollFromBottom < PREVENT_AUTO_SCROLL_THRESHOLD) {
            scrollToBottom();
        }
    }, [list, scrollContainer, messageIds?.length]);

    const recipientLink = (
        <Link href={`/users/${recipient.id}`}>
            <a>
                <strong>{recipient.display_name || recipient.username}</strong>
            </a>
        </Link>
    )
    return(
        <div className={styles['list-container']}>
            <div className={styles['scroll-container']} ref={scrollContainer}>
                {!messageIds && (
                    <div className={styles['loading']}>
                        <Loader />
                    </div>
                )}
                
                {!loading && !messageIds?.length && (
                    <span className={styles['list-label']}>
                        {t('noMessages')}
                        {' '}
                        {recipientLink}
                        {' '}
                        {t('yet')}
                    </span>
                )}

                {messageIds?.length !== 0 && reachedEnd && (
                    <span className={styles['list-label']}>
                        {t('reachedEnd')}
                        {' '}
                        {recipientLink}
                    </span>
                )}

                {messageIds && (
                    <ul className={styles['list']} ref={list}>
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
                )}
            </div>
        </div>
    )
}