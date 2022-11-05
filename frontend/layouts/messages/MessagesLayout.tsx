import styles from './MessagesLayout.module.scss';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect, useRef } from "react"
import { useRouter } from 'next/router';
import { useScreenType } from '../../hooks/useScreenType';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import { setChannels } from '../../redux/messages/actions';
import { LoginPrompt } from '../../components/login-prompt/LoginPrompt';
import { selectChannelIds, selectChannelsLoading } from '../../redux/messages/selectors';
import { Channel } from '../../types';
const MessagesSidebar = dynamic(() => import('./MessagesSidebar').then(res => res.MessagesSidebar), { ssr: false });

export const MessagesLayout: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const { channelId } = useRouter().query;
    const { get, token, loading } = useAuth();
    const screenType = useScreenType();
    const dispatch = useDispatch();
    const channels = useAppSelector(selectChannelIds);
    const channelsLoading = useAppSelector(selectChannelsLoading);
    const fetching = useRef(false);

    // Fetching message channels
    useEffect(() => {
        if(loading || !channelsLoading || channels.length || fetching.current) return;

        // User is not logged in
        if(!token) {
            dispatch(setChannels([]));
            return;
        }

        // Getting channels
        fetching.current = true;
        get<Channel[]>(`/users/@me/channels`)
            .then(channels => {
                dispatch(setChannels(channels));
                fetching.current = false;
            })
    }, [loading, token, channels, channelsLoading]);

    if(!loading && !token) {
        return(
            <LoginPrompt />
        )
    }

    return(
        <div className={styles['container']}>
            {(!channelId || screenType === 'large') && (
                <MessagesSidebar />
            )}
            
            {children}
        </div>
    )
}