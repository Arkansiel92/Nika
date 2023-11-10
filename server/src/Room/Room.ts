import { v4 } from 'uuid';
import Io from '../Io/Io';
import Socket from '../Socket/Socket';

class Room
{
    private uuid: string
    private sockets: Array<Socket>
    private io: Io

    constructor() {
        this.uuid = v4();
        this.sockets = [];
        this.io = new Io();
    }

    public getUuid(): string {
        return this.uuid;
    }

    public addSocket(socket: Socket): this {
        this.sockets.push(socket);
        return this;
    }

    public removeSocket(socket: Socket): this {
        let index = this.sockets.indexOf(socket);

        if(index > -1) {
            this.sockets.splice(index, 1);
        }

        return this;
    }

    public setUsersWriting({room, value}: {room: string, value: boolean}): void {
        console.log(room, value);
    }
}

export default Room;