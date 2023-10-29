import express, { Express } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Socket from '../Socket/Socket';

class Io
{
    private static instance: Io = new Io();
    private app: Express
    private server: http.Server
    private io: Server

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);

        this.initialize();
    }

    private initialize(): void {
        this.io.on('connect', (socket) => {
            console.log(`new socket : ${socket.id}`);
            new Socket(socket);
        })
    }

    public static getInstance(): Io {
        return Io.instance;
    }

    public start(port: number) {
        this.server.listen(port, () => {
            console.log(`SERVER RUNNING ON PORT ${port}`);
        });
    }
}

export default Io;