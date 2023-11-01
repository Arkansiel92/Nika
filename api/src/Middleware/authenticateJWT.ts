import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

interface AuthenticatedRequest extends Request {
    user?: any; // Vous pouvez ajuster le type de user selon vos besoins
}

const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    dotenv.config();
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET as string, function(err, user) {
            if(err) {
                return res.status(401).send({ code: 401, msg: 'Non autorisé.' });
            }

            next();
        })
    } else {
        res.status(401).send({ code: 401, msg: 'Non autorisé.' });
    }
}

export default authenticateJWT;