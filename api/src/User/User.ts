import bcrypt from 'bcrypt';
import Database from "../Database/Database";
import { Credentials } from "../Types/Credentials";
import jwt from 'jsonwebtoken';
import { User as UserType } from "../Types/User";
import { Parameters } from '../Types/Parameters';
import autoParseJSON from '../Services/AutoParseJSON';

class User extends Database {
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

    public async addUser(credentials: Credentials) {
        let connection = this.getConnection();
        let hashPassword = await this.hashPassword(credentials.password);

        if (await this.isUserExistByEmail(credentials.email)) {
            throw 'Un compte avec cette adresse mail existe déjà.';
        }

        connection.query(
            'INSERT INTO users(username, email, password) VALUES (?, ?, ?)',
            [
                credentials.username,
                credentials.email,
                hashPassword
            ]
        )
    }

    public generateAccessToken(data: any) {
        return jwt.sign(
            data,
            process.env.TOKEN_SECRET as string,
            { expiresIn: '60d' }
        );
    }

    public verifyAccessToken(token: string) {
        return jwt.verify(
            token,
            process.env.TOKEN_SECRET as string
        )
    }

    public async findAll() {
        return new Promise(async (resolve, reject) => {
            let connection = this.getConnection();
            let sql = '';
        })
    }

    public async findBy(table: string, params: Parameters) {
        return new Promise(async (resolve, reject) => {
            let keys = Object.keys(params);
            let paramsStr = keys.map((p) => p + ' = ?');
            let connection = this.getConnection();
            let sql = `SELECT * FROM ${table} where ${paramsStr.join(' and ')}`

            connection.query(sql, Object.values(params), async function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            })
        })
    }

    public async findConversations() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) {
                reject('Veuillez vous connecter.');
                return;
            }

            let connection = this.getConnection();
            let sql = `SELECT u.id, u.username, u.email, m.content, m.published_at
            FROM users u
            JOIN (
                SELECT COALESCE(sender_id, receiver_id) as user_id, MAX(id) as last_message_id
                FROM messages
                WHERE sender_id = ? OR receiver_id = ?
                GROUP BY COALESCE(sender_id, receiver_id)
            ) last_messages ON u.id = last_messages.user_id
            JOIN messages m ON last_messages.last_message_id = m.id;`;

            connection.query(sql, [this.id, this.id], function(err, result) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(autoParseJSON(result));
            })
        })
    }

    public async findUserByEmailMessages() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) {
                reject('Veuillez vous connecter.');
                return;
            }

            let connection = this.getConnection();
            let sql = `SELECT
                m.id,
                m.content,
                m.published_at,
                JSON_OBJECT("id", u.id, "username", u.username) AS sender,
                JSON_OBJECT("id", u2.id, "username", u2.username) AS receiver
                FROM messages AS m
                JOIN users AS u
                ON u.id = m.sender_id
                JOIN users AS u2
                ON u2.id = m.receiver_id
                WHERE m.sender_id = ?
                OR m.receiver_id = ?
                GROUP BY m.id, sender, receiver
                ORDER BY m.published_at DESC;`;

            connection.query(sql, [this.id, this.id], function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                console.log(result);
                

                resolve(autoParseJSON(result));
            })
        })
    }

    public async findMessagesByUser(targetId: string) {
        return new Promise(async (resolve, reject) => {
            if (!this.id) {
                reject('Veuillez vous connecter');
                return;
            }

            let connection = this.getConnection();
            let sql = `SELECT * FROM messages 
                WHERE (receiver_id = ? AND sender_id = ?) 
                OR (receiver_id = ? AND sender_id = ?) 
                ORDER BY published_at`;

            connection.query(sql, [
                this.id, 
                targetId, 
                targetId,
                this.id
            ], async function (err, result) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(autoParseJSON(result));
            })
        })
    }

    public async findUserById(id: string) {
        return new Promise(async (resolve, reject) => {
            let connection = this.getConnection();
            let sql = 'SELECT id, email, username from users where id = ?'

            connection.query(sql, [id], async function (err, result) {
                if (err) {
                    reject(err);
                    return;
                };

                if (result.length) {
                    resolve(result[0]);
                }
            })
        })
    }

    public async findUserByEmail(email: string): Promise<UserType> {
        return new Promise(async (resolve, reject) => {
            let connection = this.getConnection();
            let sql = 'SELECT * from users where email = ?'

            connection.query(sql, [email], async function (err, result) {
                if (err) {
                    reject(err);
                    return;
                };

                if (result.length) {
                    resolve(result[0]);
                } else {
                    reject("L'adresse mail n'est associé à aucun compte.");
                }
            })
        })
    }

    public async isUserExistByEmail(email: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let connection = this.getConnection();
            let sql = 'SELECT * from users where email = ?';

            connection.query(sql, [email], async function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(!!res.length); // !! convert value to boolean
            });
        });
    }

    public async comparePassword(password: string, hashPassword: string) {
        return bcrypt.compare(password, hashPassword)
            .then(res => res)
    }

    private async hashPassword(password: string) {
        return bcrypt.hash(password, 10)
            .then(hash => hash)
    }
}

export default User;