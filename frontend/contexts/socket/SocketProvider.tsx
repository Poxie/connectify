import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';
import { addChannel, addMessage, setChannelFirst, setChannelTyping } from '../../redux/messages/actions';
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
        const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT, { 
            auth: { token }
        });
        
        // Socket connection events
        socket.on('connect', () => {
            console.log('CONNECTED:', socket.id)
            setSocket(socket);
        })

        // Socket disconnect events
        socket.on('disconnect', (reason, description) => {
            console.log('DISCONNECTED:', reason)
        })

        // Socket direct messages
        socket.on('direct_message', (message) => {
            console.log('direct message:', message);
            dispatch(addMessage(message.channel_id, message, message.author_id !== profile.id));
            dispatch(setChannelFirst(message.channel_id))
        })

        // Socket channel typing
        const typingChannels: {[channelId: number]: NodeJS.Timeout} = {};
        socket.on('channel_typing', ({ channel_id: channelId, state }) => {
            console.log('channel typing:', channelId)
            dispatch(setChannelTyping(channelId, state === 'start' ? 'increase' : 'reset'));

            // Checking if timeout to cancel typing should reset
            if(typingChannels[channelId]) {
                clearTimeout(typingChannels[channelId]);
            }

            // Resetting channel typing state
            const timeout = setTimeout(() => {
                dispatch(setChannelTyping(channelId, 'reset'))
            }, 5000);
            typingChannels[channelId] = timeout;
        })

        // Socket channel created
        socket.on('dm_channel_created', async channelId => {
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