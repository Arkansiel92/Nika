import { Express } from 'express';
import Server from "../Server/Server";
import UsersRoute from './UsersRoute';

class ServiceRoute
{
    public app: Express

    constructor() {
        this.app = Server.app
    }
}

export default ServiceRoute