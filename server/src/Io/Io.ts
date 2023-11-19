import express, { Express } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Socket from '../Socket/Socket';

class Io
{
    private static instance: Io = new Io();
    private static app: Express = express();
    private static server: http.Server = http.createServer(this.app);
    public static io: Server;
    private sockets: any

    constructor() {
        this.sockets = {};
        
        Io.initialize();
    }

    private static initialize(): void {
        Io.io = new Server(Io.server);
        
        Io.io.on('connect', (socket) => {
            new Socket(socket);  
        })
    }

    public static getInstance(): Io {
        if (!Io.instance) {
            Io.instance = new Io();
        }

        return Io.instance;
    }

    public getSockets() {
        return this.sockets;
    }

    public getSocket(id: string): Socket {
        return this.sockets[id];
    }

    public addSocket(socket: Socket): this | void {
        const id = socket.getUser()?.id

        if(!id) return;

        this.sockets[id] = socket;
        return this;
    }

    public start(port: number) {
        Io.server.listen(port, () => {
            console.log(`SERVER RUNNING ON PORT ${port}`);
        });
    }
}

export default Io;