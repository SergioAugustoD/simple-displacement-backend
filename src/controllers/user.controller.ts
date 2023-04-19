import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import db from '../config/database';
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
  await db
    .query(
      'INSERT INTO users (name, last_name, email,login,password,created_on) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, last_name, email, login, await encryptPass(password), date]
    )
    .then(() => {
      return res.status(200).send({
        message: `Usuário ${name + ' ' + last_name} adicionado com sucesso!!`
      });
    })
    .catch(() => {
      return res.status(404).send({
        message: 'Erro ao tentar inserir o usuário, verifique!'
      });
    });
};

const checkPassword = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  await db
    .query('SELECT password FROM users where login = $1', [login])
    .then((r) => {
      if (bcrypt.compareSync(password, r.rows[0].password)) {
        res.send({
          isChecked: true
        });
      } else {
        res.send({
          isChecked: false
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        msg: 'Usuário não existe, verifique!'
      });
    });
};

export = { createUser, checkPassword };
