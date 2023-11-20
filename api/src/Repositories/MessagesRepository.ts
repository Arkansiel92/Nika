import autoParseJSON from "../Services/AutoParseJSON";
import ServiceEntityRepository from "./ServiceEntityRepository";

class MessagesRepository extends ServiceEntityRepository {
    constructor() {
        super('messages');
    }

    public findConversationsByUser(userId: string | null){
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT u.id, u.username, u.email, m.content, m.published_at
            FROM users u
            JOIN (
                SELECT COALESCE(sender_id, receiver_id) as user_id, MAX(id) as last_message_id
                FROM messages
                WHERE sender_id = ? OR receiver_id = ?
                GROUP BY COALESCE(sender_id, receiver_id)
            ) last_messages ON u.id = last_messages.user_id
            JOIN messages m ON last_messages.last_message_id = m.id;`;

            this.getConnection().query(sql, [userId, userId], function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(autoParseJSON(result));
            })
        })
    }

    public async findMessagesByUser(userId: string, targetId: string) {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM messages 
            WHERE (receiver_id = ? AND sender_id = ?) 
            OR (receiver_id = ? AND sender_id = ?) 
            ORDER BY published_at`;

            this.getConnection().query(sql, [
                userId,
                targetId,
                targetId,
                userId
            ], async function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(autoParseJSON(result));
            })
        })
    }
}

export default MessagesRepository;