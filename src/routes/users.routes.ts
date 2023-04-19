import express from 'express';

import userController from '../controllers/user.controller';

const app = express();

// responsável por setar as rotas de usuário
app.post('/user-add', userController.createUser);
app.post('/user/check-password', userController.checkPassword);

export default {
  app
};
