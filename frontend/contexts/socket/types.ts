import { Socket } from "socket.io-client"

export type SocketContext = {
    socket: Socket | null;
}