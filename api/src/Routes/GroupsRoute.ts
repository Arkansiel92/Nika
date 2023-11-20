import Groups from "../Entities/Groups";
import authenticateJWT from "../Middleware/authenticateJWT";
import GroupsRepository from "../Repositories/GroupsRepository";
import ServiceRoute from "./ServiceRoute";

class GroupsRoute extends ServiceRoute {
    private repository: GroupsRepository
    private entity: Groups

    constructor() {
        super();
        this.repository = new GroupsRepository();
        this.entity = new Groups();

        this.initialize();
    }

    private initialize() {
        this.app.get('/api/groups/:userId', authenticateJWT, async (req, res) => {
            try {
                let data = await this.repository.findGroupsByUser(req.params['userId']);

                res.status(200).send({ code: 200, data: data });
            } catch (error) {
                console.log(error);

                res.status(500).send({ code: 500, msg: error });
            }

        })

    }
}

export default GroupsRoute;