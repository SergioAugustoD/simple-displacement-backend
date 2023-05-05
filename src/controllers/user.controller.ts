import { Request, Response } from 'express';

import { userModel } from '../models/users';
import { User } from '../types/User';
import { badRequest } from '../utils/errors';

const insertUser = (req: Request, res: Response) => {
  {
    const user = req.body;

    if (!user.name) return badRequest(res, 'Informe seu nome!');
    if (!user.last_name) return badRequest(res, 'Informe seu sobrenome!');
    if (!user.email) return badRequest(res, 'Informe seu e-mail!');
    if (!user.login) return badRequest(res, 'Informe seu login!');
    if (!user.password) return badRequest(res, 'Informe sua senha!');
  }

  const user = req.body as User;
  userModel.createUser(user).then((e) => {
    res.json({ e });
  });
};

const userLogin = (req: Request, res: Response) => {
  {
    const user = req.body;

    if (!user.login) return badRequest(res, 'Informe seu login');
    if (!user.password) return badRequest(res, 'Informe sua senha');
  }

  const user = req.body as User;
  userModel.login(user).then((resp) => {
    res.json(resp);
  });
};

const checkInfoUser = (req: Request, res: Response) => {
  {
    const user = req.body;

    if (!user.login) return badRequest(res, 'Login não informado');
  }

  const user = req.body as User;
  userModel.checkIsLogged(user).then((e) => {
    res.json(e);
  });
};

export const userController = {
  insertUser,
  userLogin,
  checkInfoUser
};
