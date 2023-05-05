import { Request, Response } from 'express';

import { licenseModel } from '../models/licenses';
import { User } from '../types/User';
import { badRequest } from '../utils/errors';

const checkLicensedUser = (req: Request, res: Response) => {
  {
    const login = req.body;

    if (!login) return badRequest(res, 'Login não informado');
  }

  const login = req.body;
  licenseModel
    .checkIsLicensedUser(login)
    .then((e) => {
      res.json(e);
    })
    .catch((err) => res.json(err));
};

const createLicense = (req: Request, res: Response) => {
  {
    const user = req.body;

    if (!user.id_user) return badRequest(res, 'id_user não informado');
  }

  const user = req.body as User;
  licenseModel
    .createLicense(user)
    .then((e) => res.json(e))
    .catch((err) => res.json(err));
};

export const LicenseController = {
  createLicense,
  checkLicensedUser
};
