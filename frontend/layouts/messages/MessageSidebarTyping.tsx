import styles from './MessagesLayout.module.scss';
import { selectChannelTyping } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { useDispatch } from 'react-redux';

export const MessagesSidebarTyping: React.FC<{
    channelId: number;
}> = ({ channelId }) => {
    const dispatch = useDispatch();
    const typing = useAppSelector(state => selectChannelTyping(state, channelId));

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