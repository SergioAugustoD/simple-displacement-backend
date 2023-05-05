import { Router } from 'express';

import { userController } from '../controllers/user.controller';

const userRouter = Router();

// responsável por setar as rotas de usuário
userRouter.post('/register', userController.insertUser);
userRouter.post('/login', userController.userLogin);
userRouter.post('/info', userController.checkInfoUser);

export { userRouter };
