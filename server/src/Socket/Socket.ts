import { Socket as SocketIo } from 'socket.io';
import { User } from '../Types/User';
import { v4 } from 'uuid';
import Io from '../Io/Io';

class Socket
{
    private uuid: string;
    private socket: SocketIo
    private user: User | null;

    constructor(socket: SocketIo) {
        this.uuid = v4();
        this.socket = socket;
        this.user = null;

        this.initialize()
    }

    public initialize(): void {
        this.socket.on('login', (user) => this.setUser(user));
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getSocket(): SocketIo {
        return this.socket;
    }

    public setUser(user: User): this {
        this.user = user;
        console.log(`l'utilisateur ${user.username} est connecté !`);

        return this;
    }

    public getUser(): User | null {
        return this.user;
    }
}

export default Socket