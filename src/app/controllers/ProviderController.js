import User from '../models/User';
import File from '../models/File';

class ProviderController{

    async index(req, res){
        const providers = await User.findAll({
            where: {provider: true},
            attributes: ['id', 'name', 'email', 'file_id'],
            include: [
                {
                    model: File,
                    as: 'user_picture_file',
                    attributes: ['name','path','url'],
                }
            ]
        })

        return res.json(providers); 

    }

}

export default new ProviderController;