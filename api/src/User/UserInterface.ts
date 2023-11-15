import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserInterface
{
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

    public async comparePassword(password: string, hashPassword: string) {
        return bcrypt.compare(password, hashPassword)
            .then(res => res)
    }

    public async hashPassword(password: string) {
        return bcrypt.hash(password, 10)
            .then(hash => hash)
    }
}

export default UserInterface;