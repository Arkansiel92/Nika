import { v4 } from 'uuid';
import Io from '../Io/Io';
import Socket from '../Socket/Socket';

class Room
{
    private uuid: string
    private sockets: Array<Socket>
    private usersWriting: Array<string>

    constructor() {
        this.uuid = v4();
        this.sockets = [];
        this.usersWriting = [];
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

    public setUsersWriting(socket: Socket, isWriting: boolean): void {
        const username = socket.getUser()?.username;

        if(username) {
            const isInArray = this.usersWriting.includes(username);

            if(isWriting) {
                if(!isInArray) this.usersWriting.push(username);
            } else {
                if(isInArray) this.usersWriting.splice(this.usersWriting.indexOf(username), 1);
            }

            socket.getSocket()
            .broadcast
            .to(this.uuid)
            .emit('users-writing', this.usersWriting);
        }
    }
}

export default Room;