import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';
import AuthConfig  from '../../config/auth';

class SessionController {
    async store(req, res) {
        // Fields Validation
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails !'});
        }

        const{email, password} =  req.body;

        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: File,
                    as: 'user_picture_file',
                    attributes: ['id','path', 'url']
                }
            ]
        });
        console.log(user);
        if(!user){
            return res.status(401).json({ error: 'User not found! '});
        }

        if(!(await user.checkPassword(password))){
            return res.status(401).json({ error: 'Password does not match' });
        }  
        const{id, name, provider, user_picture_file } = user;

        return res.json({
            user: {
                id,
                name,
                email,
                provider,
                user_picture_file
            },
            token: jwt.sign({id}, AuthConfig.secret, {
                expiresIn: AuthConfig.expiresIn,
            }),
        });
        


    }
}

export default new SessionController();