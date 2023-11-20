import UserInterface from "../Services/User/UserInterface";

class Users extends UserInterface {
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
}

export default Users;