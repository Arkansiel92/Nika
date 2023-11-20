import Messages from "../Entities/Messages";
import authenticateJWT from "../Middleware/authenticateJWT";
import MessagesRepository from "../Repositories/MessagesRepository";
import ServiceRoute from "./ServiceRoute";

class MessagesRoute extends ServiceRoute
{
    private repository: MessagesRepository;
    private entity: Messages

    constructor() {
        super();
        this.repository = new MessagesRepository();  
        this.entity = new Messages();

        this.initialize();
    }

    private initialize() {
        this.app.get('/api/messages/:userId', authenticateJWT, async (req, res) => {
            try {
                let data = await this.repository.findConversationsByUser(req.params['userId']);

                res.status(200).send({ code: 200, msg: 'Récupération des conversations', data: data});
            } catch (error) {
                console.log(error);
                
                res.status(500).send({ code: 500, msg: error });
            }
        });

        this.app.post('/api/:userId/messages/:targetId', authenticateJWT, async (req, res) => {
            try {
   
                this.repository.insert(['receiver_id', 'sender_id', 'content'], [req.body.receiver_id, req.body.sender_id, req.body.content]);
    
                let data = this.repository.findMessagesByUser(req.params['userId'], req.body.receiver_id);
                
                res.status(200).send({ code: 200, data: data});
            } catch (error) {
                console.log(error);

                res.status(500).send({ code: 500, msg: error });
            }
        })
    }
}

export default MessagesRoute;