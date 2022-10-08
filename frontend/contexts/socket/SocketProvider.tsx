import React, { ReactElement, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';
import { useAuth } from '../auth/AuthProvider';

const SocketContext = React.createContext({});

export const useSocket = () => React.useContext(SocketContext);

export const SocketProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
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
        })

        // Closing socket on leave
        return () => {
            socket.close();
        }
    }, [profile?.id, loading]);

    const value = {

    }
    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}