import express, { Express } from 'express';
import bodyParser from 'body-parser';
import User from '../User/User';

class Server
{
    private app: Express
    private port: number
    private user: User

    constructor() {
        this.app = express();
        this.port = 6060;
        this.user = new User();

        this.initialize()
    }

    private initialize() {
        this.app.use(bodyParser.json()); // application/json
        this.app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded

        this.app.post('/users/register', async (req, res) => {
            try {
                await this.user.addUser(req.body);

                res.status(200).send({code: 200, msg: 'Le compte a été crée avec succès.'});
            } catch (error) {
                res.status(500).send({code: 500, msg: error});
            }
        })

        this.app.post('/users/login', async (req, res) => {
            try {
                const user = await this.user.findUser(req.body.email);

                res.status(200).send({code: 200, msg: 'top'});
            } catch (error) {
                res.status(500).send({code: 500, msg: error});
            }
        })
    }
 
    public start() {
        this.app.listen(this.port, () => {
            console.log(`API RUNNING ON PORT ${this.port}`);
        })
    }

}

export default Server;