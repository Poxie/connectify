import styles from './MessagesLayout.module.scss';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect, useRef } from "react"
import { useScreenType } from '../../hooks/useScreenType';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useAppSelector } from '../../redux/store';
import { setChannels } from '../../redux/messages/actions';
import { LoginPrompt } from '../../components/login-prompt/LoginPrompt';
import { selectChannelsLoading } from '../../redux/messages/selectors';
import { useRequest } from '../../hooks/useRequest';
import { useQueryId } from '../../hooks/useQueryId';
const MessagesSidebar = dynamic(() => import('./MessagesSidebar').then(res => res.MessagesSidebar), { ssr: false });

export const MessagesLayout: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const { token, loading: tokenLoading } = useAuth();
    const channelId = useQueryId('channelId', false);
    const screenType = useScreenType();
    const channelsLoading = useAppSelector(selectChannelsLoading);
    
    // Fetching channels
    useRequest(`/users/@me/channels`, setChannels, channelsLoading && token !== null);

    // Checking if user is logged in
    if(!tokenLoading && !token) {
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