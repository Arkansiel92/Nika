import { createContext } from "react";
import { io } from "socket.io-client";
import {SERVER_ORIGIN_IP, PORT_SOCKET} from "@env";

export const socket = io(`http://${SERVER_ORIGIN_IP}:${PORT_SOCKET}`, {
    transports: ['websocket']
});

export const socketContext = createContext(socket);