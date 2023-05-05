import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import db from '../config/database';
import { LicenseController } from './licenses.controller';
// ==> Método responsável por criar um novo 'Product':

const encryptPass = async (password: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

const createUser = async (req: Request, res: Response) => {
  const date = new Date();
  const { name, last_name, email, login, password } = req.body;

  const userInfo = await db.query(
    'SELECT count(*) FROM USERS where login = $1',
    [login]
  );

  if (userInfo.rowCount > 0) {
    return res.send({
      err: true,
      message: `Usuário já existe!`
    });
  }
  await db
    .query(
      'INSERT INTO users (name, last_name, email,login,password,created_on) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, last_name, email, login, await encryptPass(password), date]
    )
    .then(() => {
      return res.send({
        err: false,
        message: `Usuário adicionado com sucesso!!`
      });
    })
    .catch(() => {
      return res.send({
        err: true,
        message: 'Erro ao tentar inserir o usuário, verifique!'
      });
    });
};

const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;
  const userInfo = await db.query(
    'SELECT US.name, US.last_name, US.email, US.login FROM USERS US LEFT JOIN LICENSES LC ON LC.id_user = US.id where login = $1',
    [login]
  );
  await db
    .query('SELECT password FROM users where login = $1', [login])
    .then((r) => {
      if (bcrypt.compareSync(password, r.rows[0].password)) {
        LicenseController.checkIsLicensedUser(login).then((r) => {
          if (r.rowCount > 0) {
            res.send({
              err: false,
              msg: 'Logado com sucesso!!',
              isLicensed: true,
              data: userInfo.rows[0]
            });
          } else {
            res.send({
              err: true,
              msg: 'Usuário não licensiado',
              isLicensed: false
            });
          }
        });
      }
    })
    .catch(() => {
      res.send({
        err: true,
        msg: 'Usuário ou senha incorretos, verifique!'
      });
    });
};
const checkIsLogged = async (req: Request, res: Response) => {
  const { login } = req.body;

  const userInfo = await db.query(
    'SELECT US.name, US.last_name, US.email, US.login FROM USERS US LEFT JOIN LICENSES LC ON LC.id_user = US.id where login = $1',
    [login]
  );

  res.send({
    data: userInfo.rows[0]
  });
};
export = { createUser, login, checkIsLogged };
