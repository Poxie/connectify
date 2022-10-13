import styles from './MessagesLayout.module.scss';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect } from "react"
import { useRouter } from 'next/router';
import { useScreenType } from '../../hooks/useScreenType';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import { selectChannelIds } from '../../redux/messages/hooks';
import { setChannels } from '../../redux/messages/actions';
const MessagesSidebar = dynamic(() => import('./MessagesSidebar').then(res => res.MessagesSidebar), { ssr: false });

export const MessagesLayout: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const { channelId } = useRouter().query;
    const { get, loading } = useAuth();
    const screenType = useScreenType();
    const dispatch = useDispatch();
    const channels = useAppSelector(selectChannelIds);

    // Fetching message channels
    useEffect(() => {
        if(loading || channels.length) return;

        // Getting channels
        get(`/users/@me/channels`)
            .then(channels => {
                dispatch(setChannels(channels));
            })
    }, [loading, get, channels]);

    return(
        <div className={styles['container']}>
            {(!channelId || screenType === 'large') && (
                <MessagesSidebar />
            )}
            {children}
        </div>
    )
}