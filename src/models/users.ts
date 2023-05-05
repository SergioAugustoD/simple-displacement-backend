import bcrypt from 'bcrypt';

import { dbQuery } from '../config/database';
import { User } from '../types/User';

const encryptPass = async (password: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

const createUser = async (user: User) => {
  const getLogin = await dbQuery('SELECT login from users where login = ?', [
    user.login
  ]);

  if (getLogin.length > 0) {
    return { err: 'Este login já existe!' };
  }
  const getEmail = await dbQuery('SELECT email from users where email = ?', [
    user.email
  ]);

  if (getEmail.length > 0) {
    return { err: 'Este e-mail já existe no banco de dados!' };
  }

  await dbQuery(
    `INSERT INTO users (name,last_name, email, login, password) VALUES(?,?,?,?,?)`,
    [
      user.name,
      user.last_name,
      user.email,
      user.login,
      await encryptPass(user.password)
    ]
  );
};

const login = async (user: User) => {
  const userInfo = await dbQuery(
    'SELECT US.name, US.last_name, US.email, US.login FROM USERS US LEFT JOIN LICENSES LC ON LC.id_user = US.id where login = ?',
    [user.login]
  );
  const isLogged = await dbQuery('SELECT password FROM users where login = ?', [
    user.login
  ])
    .then((r) => {
      if (bcrypt.compareSync(user.password, r[0].password)) {
        return {
          err: false,
          msg: 'Logado com sucesso!!',
          isLicensed: true,
          data: userInfo[0]
        };
      } else {
        return {
          err: true,
          msg: 'Usuário não licensiado',
          isLicensed: false
        };
      }
    })
    .catch(() => {
      return {
        err: true,
        msg: 'Usuário ou senha incorretos, verifique!'
      };
    });

  return isLogged;
};

const checkIsLogged = async (user: User) => {
  const userInfo = await dbQuery(
    'SELECT US.name, US.last_name, US.email, US.login FROM USERS US LEFT JOIN LICENSES LC ON LC.id_user = US.id where login = ?',
    [user.login]
  );

  return { data: userInfo[0] };
};

export const userModel = {
  createUser,
  login,
  checkIsLogged
};
