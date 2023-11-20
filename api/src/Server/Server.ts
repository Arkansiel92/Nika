import express, { Express } from 'express';
import bodyParser from 'body-parser';
import authenticateJWT from '../Middleware/authenticateJWT';
import UsersRepository from '../Repositories/UsersRepository';
import MessagesRepository from '../Repositories/MessagesRepository';
import Users from '../Entities/User';
import GroupsRepository from '../Repositories/GroupsRepository';

class Server
{
    private app: Express
    private port: number
    private user: Users

    constructor() {
        this.app = express();
        this.port = 6060;
        this.user = new Users();

        this.initialize()
    }

    private initialize() {
        this.app.use(bodyParser.json()); // application/json
        this.app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded

        this.app.post('/users/register', async (req, res) => {
            try {
                let usersRepo = new UsersRepository();
                let passwordHash = await this.user.hashPassword(req.body.password);

                await usersRepo.insert(
                    ['username', 'email', 'password'],
                    [req.body.username, req.body.email, passwordHash]
                );

                res.status(200).send({code: 200, msg: 'Le compte a été crée avec succès.'});
            } catch (error) {
                console.log(error);

                res.status(500).send({code: 500, msg: error});
            }
        })

        this.app.post('/users/login', async (req, res) => {
            try {
                let usersRepo = new UsersRepository();

                let user: any = await usersRepo.findOneBy({email: req.body.email});
                
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
                let messagesRepo = new MessagesRepository();
                let data = await messagesRepo.findConversationsByUser(this.user.getId());

                res.status(200).send({ code: 200, msg: 'Récupération des conversations', data: data});
            } catch (error) {
                console.log(error);
                
                res.status(500).send({ code: 500, msg: error });
            }
        })

        this.app.get('/:userId/messages/:targetId', authenticateJWT, async (req, res) => {
            try {
                let messagesRepo = new MessagesRepository();
                let usersRepo = new UsersRepository();
                
                let data = await messagesRepo.findMessagesByUser(req.params['userId'], req.params['targetId']);
                let target = await usersRepo.findOneBy({ id: req.params['targetId'] });

                res.status(200).send({ code: 200, msg: 'Récupération des messages', data: data, target: target});
            } catch (error) {
                res.status(500).send({ code: 500, msg: error });
            }
        })

        this.app.post("/messages/:userId", authenticateJWT, async (req, res) => {
            try {
                const messagesRepo = new MessagesRepository();
    
                await messagesRepo.insert(['receiver_id', 'sender_id', 'content'], [req.body.receiver_id, req.body.sender_id, req.body.content]);
    
                let data = await messagesRepo.findMessagesByUser(req.params['userId'], req.body.receiver_id);
                
                res.status(200).send({ code: 200, data: data});
            } catch (error) {
                console.log(error);

                res.status(500).send({ code: 500, msg: error });
            }
        });

        this.app.get("/api/groups/:userId", authenticateJWT, async (req, res) => {
            try {
                const GroupsRepo = new GroupsRepository();
                let data = await GroupsRepo.findGroupsByUser(req.params['userId']);

                res.status(200).send({ code: 200, data: data });
            } catch (error) {
                console.log(error);

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