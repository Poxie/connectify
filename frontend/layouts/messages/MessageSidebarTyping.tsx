import styles from './MessagesLayout.module.scss';
import { selectChannelTyping } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setChannelTyping } from '../../redux/messages/actions';

export const MessagesSidebarTyping: React.FC<{
    channelId: number;
}> = ({ channelId }) => {
    const dispatch = useDispatch();
    const typing = useAppSelector(state => selectChannelTyping(state, channelId));

    // Removing typing after delay
    useEffect(() => {
        if(!typing) return;

        // After delay, removing indicator
        const timeout = setTimeout(() => {
            dispatch(setChannelTyping(channelId, 'reset'));
        }, 5000);

        return () => clearTimeout(timeout);
    }, [channelId, typing]);

    // Returning null if no typing
    if(!typing) return null;

    return(
        <div className={styles['typing-indicator']} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}