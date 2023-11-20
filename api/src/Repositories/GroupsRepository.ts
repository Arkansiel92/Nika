import autoParseJSON from "../Services/AutoParseJSON";
import ServiceEntityRepository from "./ServiceEntityRepository";

class GroupsRepository extends ServiceEntityRepository
{
    constructor() {
        super('groups');
    }

    public async findGroupsByUser(userId: string): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT DISTINCT g.id, g.uuid, g.name, g.administrator 
            FROM groups g 
            JOIN group_users gu ON g.id = gu.group_id 
            WHERE gu.user_id = ?`;

            this.getConnection().query(sql, [userId], async function(err, result) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(autoParseJSON(result));
            })
        })
    }
}

export default GroupsRepository;