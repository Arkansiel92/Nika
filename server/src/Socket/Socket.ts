import { Socket as SocketIo } from 'socket.io';

class Socket
{
    private socket: SocketIo

    constructor(socket: SocketIo) {
        this.socket = socket;

        this.initialize()
    }

    public initialize() {

    }

    public getSocket() {
        return this.socket;
    }
}

export default Socket