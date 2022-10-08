import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';
import { addMessage } from '../../redux/messages/actions';
import { useAuth } from '../auth/AuthProvider';
import { SocketContext as SocketContextType } from './types';

const SocketContext = React.createContext({} as SocketContextType);

export const useSocket = () => React.useContext(SocketContext);

export const SocketProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const dispatch = useDispatch();
    const { profile, loading } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if(loading || !profile) return;

        // Creating websocket
        const socket = io('http://localhost:8000', { 
            query: { id: profile.id }
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
        })

        // Closing socket on leave
        return () => {
            socket.close();
        }
    }, [profile?.id, loading]);

    const value = {
        socket
    }
    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}