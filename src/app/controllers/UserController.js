import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';


class UserController {
    async store(req, res) {
        // Fields Validation
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails !'});
        }
        
        const UserExists = await User.findOne({where:{email: req.body.email}});
        
        if(UserExists){
            return res.status(400).json({error: 'User already exists.'})
        }
        const user =  await User.create(req.body);
        
        return res.json(user);
    }

    async update(req, res) {
        // Fields Validation
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().required().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            passwordConfirm: Yup.string()
                .when('password', (password, field) =>
                    password ? field.required().oneOf([Yup.ref('password')]) : field
                ),
        });

        if(!(await schema.isValid (req.body))) {
            return res.status(400).json({ error: 'Validation Fails !'});
        }

        const {email , oldPassword} = req.body;
        
        console.log(oldPassword);
        const user = await User.findByPk(req.userId);

        if(email != user.email) {
            const emailExists = await User.findOne({ where: { email } });
            
            if (emailExists) {
                return res.status(400).json({ error: 'Email in used '});
            }
        }

        if(oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({Error: 'Password does not match '})
        }
        
         await user.update(req.body);
         const {id, name, provider, user_picture_file } = await User.findByPk(req.userId, {
            include: [
                {
                    model: File,
                    as: 'user_picture_file',
                    attributes: ['id','path', 'url']
                }
            ]
         });


        return res.json({
            id, 
            name, 
            email,
            provider,
            user_picture_file,
        });
        
    }

}

export default new UserController();