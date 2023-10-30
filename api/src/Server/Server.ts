import express, { Express } from 'express';
import Database from '../Database/Database';

class Server
{
    private app: Express
    private port: number
    private database: Database

    constructor() {
        this.app = express();
        this.port = 6060;
        this.database = new Database();

        this.initialize()
    }

    private initialize() {
        this.app.post('/user/login', async (req, res) => {
            console.log(req);
        })

    }
 
    public start() {
        this.app.listen(this.port, () => {
            console.log(`API RUNNING ON PORT ${this.port}`);
        })
    }

}

export default Server;