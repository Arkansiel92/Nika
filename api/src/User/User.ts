import bcrypt from 'bcrypt';
import Database from "../Database/Database";
import { Credentials } from "../Types/Credentials";

class User extends Database
{
    constructor() {
        super();
    }

    public async addUser(credentials: Credentials) {
        let connection = this.getConnection();
        let hashPassword = await this.hashPassword(credentials.password);
        let sql = 'INSERT INTO Users(username, email, password) VALUES (?, ?, ?)';
        
        try {
            connection.query(
                sql,
                [
                    credentials.username,
                    credentials.email,
                    hashPassword
                ],
                async (err) => {
                    if(err) throw err;
                    return;
                }
            )
            
        } catch (error) {
            console.log("coucou");
        }
    }

    public async comparePassword(password: string, hashPassword: string) {
        return bcrypt.compare(password, hashPassword)
        .then(res => res)
    }

    public async hashPassword(password: string) {
        return bcrypt.hash(password, 10)
        .then(hash => hash)
    }
}

export default User;