import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';
import { addChannel, addMessage, increaseUnreadCount } from '../../redux/messages/actions';
import { useAuth } from '../auth/AuthProvider';
import { SocketContext as SocketContextType } from './types';

const SocketContext = React.createContext({} as SocketContextType);

export const useSocket = () => React.useContext(SocketContext);

export const SocketProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const dispatch = useDispatch();
    const { token, profile, loading, get, patch } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if(loading || !profile) return;

        // Creating websocket
        const socket = io('http://localhost:8000', { 
            query: { token }
        });
        
        // Socket connection events
        socket.on('connect', () => {
            console.log('CONNECTED')
            setSocket(socket);
        })

        // Socket direct messages
        socket.on('direct_message', message => {
            console.log('direct message:', message);
            dispatch(addMessage(message.channel_id, message));
            
            // If user is not author, update unread count
            if(message.author_id !== profile.id) {
                dispatch(increaseUnreadCount(message.channel_id));
            }
        })

        // Socket channel created
        socket.on('DM_CHANNEL_CREATED', async channelId => {
            console.log('dm channel:', channelId);
            const channel = await get(`/channels/${channelId}`);
            dispatch(addChannel(channel));
        })

        // Closing socket on leave
        return () => {
            socket.close();
        }
    }, [profile?.id, loading, get, patch]);

    const value = {
        socket
    }
    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}