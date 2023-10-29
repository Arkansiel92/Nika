import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io('http://127.0.0.1:3001', {transports: ['websocket']});

export const socketContext = createContext(socket);