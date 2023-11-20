import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
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