import styles from './MessagesLayout.module.scss';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect } from "react"
import { useRouter } from 'next/router';
import { useScreenType } from '../../hooks/useScreenType';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import { selectChannelIds, selectChannelsLoading } from '../../redux/messages/hooks';
import { setChannels } from '../../redux/messages/actions';
import { LoginPrompt } from '../../components/login-prompt/LoginPrompt';
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

    // Fetching message channels
    useEffect(() => {
        if(loading || !channelsLoading || channels.length) return;

        // User is not logged in
        if(!token) {
            dispatch(setChannels([]));
            return;
        }

        // Getting channels
        get(`/users/@me/channels`)
            .then(channels => {
                dispatch(setChannels(channels));
            })
    }, [loading, token, get, channels, channelsLoading]);

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