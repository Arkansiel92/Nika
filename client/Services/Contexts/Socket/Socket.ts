import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io('http://192.168.134.56:3001', {transports: ['websocket']});

export const socketContext = createContext(socket);