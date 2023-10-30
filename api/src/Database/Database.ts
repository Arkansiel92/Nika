import mysql from 'mysql';

class Database
{
    private host: string;
    private user: string;
    private password: string;
    private database: string;
    private port: number;
    private connection: mysql.Connection

    constructor() {
        this.host = 'localhost'
        this.user = 'root'
        this.password = 'root'
        this.database = 'Nika'
        this.port = 3307
        this.connection = mysql.createConnection({
            host: this.host, 
            user: this.user, 
            password: this.password, 
            database: this.database, 
            port: this.port
        })

        this.initialize();
    }

    public initialize() {
        this.connection.connect(function(err) {
            if (err) throw err;
    
            console.log('Connected to DB');
        })
    }

    public getConnection() {
        return this.connection;
    }
}

export default Database;