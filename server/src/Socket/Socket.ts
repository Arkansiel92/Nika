import { Socket as SocketIo } from 'socket.io';
import { User } from '../Types/User';
import { v4 } from 'uuid';
import Room from '../Room/Room';

class Socket
{
    private uuid: string;
    private socket: SocketIo
    private user: User | null;
    private room: Room | null;

    constructor(socket: SocketIo) {
        this.uuid = v4();
        this.socket = socket;
        this.user = null;
        this.room = null;

        this.initialize()
    }

    public initialize(): void {
        this.socket.on('login', (user) => this.setUser(user));
        this.socket.on('userWriting', (data) => this.room && this.room.setUsersWriting(data));
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getSocket(): SocketIo {
        return this.socket;
    }

    public setUser(user: User | null): this {
        this.user = user;
        return this;
    }

    public getUser(): User | null {
        return this.user;
    }
}

export default Socket