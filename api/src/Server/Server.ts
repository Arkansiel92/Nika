import express, { Express } from 'express';
import bodyParser from 'body-parser';
import User from '../User/User';
import { User as UserType } from "../Types/User";
import authenticateJWT from '../Middleware/authenticateJWT';

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
                console.log(error);

                res.status(500).send({code: 500, msg: error});
            }
        })

        this.app.post('/users/login', async (req, res) => {
            try {
                const user: UserType = await this.user.findUser(req.body.email);

                if(!await this.user.comparePassword(req.body.password, user.password)) {
                    throw "Email ou mot de passe incorrect.";
                }

                const token = this.user.generateAccessToken({
                    id: user.id, 
                    email: user.email, 
                    username: user.username
                });

                this.user.setId(user.id)
                .setUsername(user.username)
                .setEmail(user.email)
                .setToken(token);

                res.status(200).send({ code: 200, msg: 'Identification correcte ! Vous allez être rediriger.', _token: token });
            } catch (error) {
                console.log(error);
                
                res.status(500).send({ code: 500, msg: error });
            }
        })

        this.app.get('/users/conversations', authenticateJWT, async (req, res) => {
            try {
                

                const data = await this.user.findConversations();

                res.status(200).send({ code: 200, msg: 'Récupération des conversations', data: data});
            } catch (error) {
                console.log(error);
                
                res.status(500).send({ code: 500, msg: error });
            }
        })

        this.app.get('/users/messages/:targetId', authenticateJWT, async (req, res) => {
            try {
                const data = await this.user.findMessagesByTarget(req.params['targetId']);

                res.status(200).send({ code: 200, msg: 'Récupération des messages', data: data});
            } catch (error) {
                res.status(500).send({ code: 500, msg: error });
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