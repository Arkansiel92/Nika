import express, { Express } from 'express';
import bodyParser from 'body-parser';
import Database from '../Database/Database';
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
            // try {
            //     let data = this.user.addUser(req.body);
                
            //     res.send({test: 'coucou'});
            // } catch (error) {
            //     console.log('Une erreur est survenue :', error);
            //     res.status(500).send();
            // }

            try {
                let data = await this.user.addUser(req.body);

                // console.log(data);

                res.status(200).send({test: 'coucou'});
            } catch (error) {
                res.status(500).send({err: error});
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