import mysql from 'mysql';

class Database
{
    private host: string;
    private user: string;
    private password: string;
    private database: string;
    private port: number;
    private con: mysql.Connection

    constructor() {
        this.host = 'localhost'
        this.user = 'root'
        this.password = 'root'
        this.database = 'Nika'
        this.port = 3307
        this.con = mysql.createConnection({
            host: this.host, 
            user: this.user, 
            password: this.password, 
            database: this.database, 
            port: this.port
        })
    }

    public connectToDatabase() {
        this.con.connect(function(err) {
            if (err) throw err;

            console.log('Connected to DB');
        })
    }
}

export default Database;