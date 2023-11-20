import Users from "../Entities/Users";
import authenticateJWT from "../Middleware/authenticateJWT";
import UsersRepository from "../Repositories/UsersRepository";
import ServiceRoute from "./ServiceRoute";

class UsersRoute extends ServiceRoute
{
    private repository: UsersRepository;
    private entity: Users

    constructor() {
        super();
        this.repository = new UsersRepository();  
        this.entity = new Users();

        this.initialize();
    }

    private initialize() {
        this.app.post('/api/auth', async (req, res) => {

            try {
                let user: any = await this.repository.findOneBy({email: req.body.email});
                
                if(!await this.entity.comparePassword(req.body.password, user.password)) {
                    throw "Email ou mot de passe incorrect.";
                }

                const token = this.entity.generateAccessToken({
                    id: user.id, 
                    email: user.email, 
                    username: user.username
                });

                this.entity.setId(user.id)
                .setUsername(user.username)
                .setEmail(user.email)
                .setToken(token);

                res.status(200).send({ code: 200, msg: 'Identification correcte ! Vous allez être rediriger.', _token: token });
            } catch (error) {
                console.log(error);
                
                res.status(500).send({ code: 500, msg: error });
            }
        })

        this.app.post('/api/users', async (req, res) => {
            try {
                let passwordHash = await this.entity.hashPassword(req.body.password);

                await this.repository.insert(
                    ['username', 'email', 'password'],
                    [req.body.username, req.body.email, passwordHash]
                );

                res.status(200).send({code: 200, msg: 'Le compte a été crée avec succès.'});
            } catch (error) {
                console.log(error);

                res.status(500).send({code: 500, msg: error});
            }
        });

        this.app.get('/api/users', authenticateJWT, async (req, res) => {
            try {
                let data = await this.repository.findAll();

                res.status(200).send({code: 200, data: data});
            } catch (error) {
                console.log(error);

                res.status(500).send({code: 500, msg: error});
            }
        })
    }
}

export default UsersRoute;