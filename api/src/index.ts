import Server from "./Server/Server";
import dotenv from 'dotenv';

dotenv.config();

const server = new Server();
server.start();