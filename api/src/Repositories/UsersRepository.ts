import ServiceEntityRepository from "./ServiceEntityRepository";

class UsersRepository extends ServiceEntityRepository
{
    constructor() {
        super('users');
    }
}

export default UsersRepository;