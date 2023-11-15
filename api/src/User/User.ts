import UserInterface from "./UserInterface";

class User extends UserInterface {
    private id: number | null
    private username: string | null
    private email: string | null
    private token: string | null

    constructor() {
        super();
        this.id = null;
        this.username = null;
        this.email = null;
        this.token = null;
    }

    public setId(id: number | null): this {
        this.id = id;
        return this;
    }

    public getId(): number | null {
        return this.id;
    }

    public setUsername(username: string | null): this {
        this.username = username;
        return this;
    }

    public getUsername(): string | null {
        return this.username;
    }

    public setEmail(email: string | null): this {
        this.email = email;
        return this;
    }

    public getEmail(): string | null {
        return this.email;
    }

    public setToken(token: string | null): this {
        this.token = token;
        return this;
    }

    public getToken(): string | null {
        return this.token;
    }

    public getUser() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            token: this.token
        }
    }

    public isUserLogged(): boolean {
        if(this.id) return true;

        return false;
    }

    // public async findUserByEmailMessages() {
    //     return new Promise(async (resolve, reject) => {
    //         if (!this.id) {
    //             reject('Veuillez vous connecter.');
    //             return;
    //         }

    //         let connection = this.getConnection();
    //         let sql = `SELECT
    //             m.id,
    //             m.content,
    //             m.published_at,
    //             JSON_OBJECT("id", u.id, "username", u.username) AS sender,
    //             JSON_OBJECT("id", u2.id, "username", u2.username) AS receiver
    //             FROM messages AS m
    //             JOIN users AS u
    //             ON u.id = m.sender_id
    //             JOIN users AS u2
    //             ON u2.id = m.receiver_id
    //             WHERE m.sender_id = ?
    //             OR m.receiver_id = ?
    //             GROUP BY m.id, sender, receiver
    //             ORDER BY m.published_at DESC;`;

    //         connection.query(sql, [this.id, this.id], function (err, result) {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }

    //             console.log(result);
                

    //             resolve(autoParseJSON(result));
    //         })
    //     })
    // }

    // public async findMessagesByUser(targetId: string) {
    //     return new Promise(async (resolve, reject) => {
    //         if (!this.id) {
    //             reject('Veuillez vous connecter');
    //             return;
    //         }

    //         let connection = this.getConnection();
    //         let sql = `SELECT * FROM messages 
    //             WHERE (receiver_id = ? AND sender_id = ?) 
    //             OR (receiver_id = ? AND sender_id = ?) 
    //             ORDER BY published_at`;

    //         connection.query(sql, [
    //             this.id, 
    //             targetId, 
    //             targetId,
    //             this.id
    //         ], async function (err, result) {
    //             if(err) {
    //                 reject(err);
    //                 return;
    //             }

    //             resolve(autoParseJSON(result));
    //         })
    //     })
    // }

    // public async findUserById(id: string) {
    //     return new Promise(async (resolve, reject) => {
    //         let connection = this.getConnection();
    //         let sql = 'SELECT id, email, username from users where id = ?'

    //         connection.query(sql, [id], async function (err, result) {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             };

    //             if (result.length) {
    //                 resolve(result[0]);
    //             }
    //         })
    //     })
    // }

    // public async findUserByEmail(email: string): Promise<UserType> {
    //     return new Promise(async (resolve, reject) => {
    //         let connection = this.getConnection();
    //         let sql = 'SELECT * from users where email = ?'

    //         connection.query(sql, [email], async function (err, result) {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             };

    //             if (result.length) {
    //                 resolve(result[0]);
    //             } else {
    //                 reject("L'adresse mail n'est associé à aucun compte.");
    //             }
    //         })
    //     })
    // }

    // public async isUserExistByEmail(email: string): Promise<boolean> {
    //     return new Promise<boolean>(async (resolve, reject) => {
    //         let connection = this.getConnection();
    //         let sql = 'SELECT * from users where email = ?';

    //         connection.query(sql, [email], async function (err, res) {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }

    //             resolve(!!res.length); // !! convert value to boolean
    //         });
    //     });
    // }
}

export default User;