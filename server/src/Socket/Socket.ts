import { Socket as SocketIo } from 'socket.io';
import { User } from '../Types/User';
import { v4 } from 'uuid';
import Room from '../Room/Room';
import Io from '../Io/Io';

class Socket
{
    private uuid: string;
    private socket: SocketIo
    private io: Io
    private user: User | null;
    private room: Room | null;

    constructor(socket: SocketIo) {
        this.uuid = v4();
        this.socket = socket;
        this.io = Io.getInstance();
        this.user = null;
        this.room = null;

        this.initialize()
    }

    public initialize(): void {
        console.log(`new socket : ${this.socket.id}`);

        this.socket.on('login', (user) => this.setUser(user));
        this.socket.on('set-conversation', (targetId) => this.setConversation(targetId));
        this.socket.on('userWriting', (isWriting) => this.room && this.room.setUsersWriting(this, isWriting));
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getSocket(): SocketIo {
        return this.socket;
    }

    public getIo(): Io {
        return this.io;
    }

    public setUser(user: User | null): this {
        this.user = user;
        this.io.addSocket(this);
        return this;
    }

    public getUser(): User | null {
        return this.user;
    }

    public setConversation(targetId: string): this {
        const target = this.io.getSocket(targetId);
        
        if(target?.room) {
            this.room = target.room;
        } else {
            this.room = new Room();
        }
        
        this.room.addSocket(this);
        this.socket.join(this.room.getUuid());
        this.socket.emit('set-conversation', this.room.getUuid());

        return this;
    }

    public getRoom(): Room | null {
        return this.room;
    }
}

export default Socket