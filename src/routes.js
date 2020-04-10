import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import Auth from './app/middlewares/auth';

const routes = new Router();

routes.get('/', async (req, res) => {
    return res.json('Hello UBarber!');
});

routes.post( '/users', UserController.store);
routes.post( '/sessions', SessionController.store);


routes.use(Auth);
routes.put( '/users', UserController.update);



export default routes;