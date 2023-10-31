import bcrypt from 'bcrypt';
import Database from "../Database/Database";
import { Credentials } from "../Types/Credentials";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User as UserType } from "../Types/User";

class User extends Database
{
    constructor() {
        super();
        dotenv.config();
    }

    public async addUser(credentials: Credentials) {
        let connection = this.getConnection();
        let hashPassword = await this.hashPassword(credentials.password);

        if(await this.isUserExistByEmail(credentials.email)) {
            throw 'Un compte avec cette adresse mail existe déjà.';
        }

        connection.query(
            'INSERT INTO Users(username, email, password) VALUES (?, ?, ?)',
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

    public async findUser(email: string): Promise<UserType> {
        return new Promise(async (resolve, reject) => {
            let connection = this.getConnection();
            let sql = 'SELECT * from Users where email = ?'

            connection.query(sql, [email], async function(err, result) {
                if(err) {
                    reject(err);
                    return;
                };

                if(result.length) {
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
            let sql = 'SELECT * from Users where email = ?';
    
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