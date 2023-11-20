import express, { Express } from 'express';
import bodyParser from 'body-parser';
import UsersRoute from '../Routes/UsersRoute';
import MessagesRoute from '../Routes/MessagesRoute';
import GroupsRoute from '../Routes/GroupsRoute';

class Server
{
    public static app: Express = express();
    private port: number

    constructor() {
        // this.app = express();
        this.port = 6060;

        this.initialize()
    }

    private initialize() {
        Server.app.use(bodyParser.json()); // application/json
        Server.app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded

        new UsersRoute();
        new MessagesRoute();
        new GroupsRoute();
    }

    public start() {
        Server.app.listen(this.port, () => {
            console.log(`API RUNNING ON PORT ${this.port}`);
        })
    }
}

export default Server;