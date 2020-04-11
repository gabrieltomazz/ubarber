import Sequelize from 'sequelize';
import Mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';



const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init(){
        this.connecion = new Sequelize(databaseConfig);

        models
            .map(model => model.init(this.connecion))
            .map(model => model.associate && model.associate(this.connecion.models));
    }

    mongo() {
        this.mongoConnection = Mongoose.connect(
            'mongodb://localhost:27017/ubarber',
            { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true  }
        );
        
    }

}

export default new Database();