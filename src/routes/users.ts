import { Router } from 'express';

import userController from '../controllers/user.controller';

const userRouter = Router();

// responsável por setar as rotas de usuário
userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.login);
userRouter.post('/info', userController.checkIsLogged);

export { userRouter };
