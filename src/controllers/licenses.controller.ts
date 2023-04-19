import { Request, Response } from 'express';

import db from '../config/database';

const createLicense = async (req: Request, res: Response) => {
  let msg = '';
  let isError = false;

  const date = new Date();
  const { licensed_to, licensed_from, is_lincensed, id_user } = req.body;

  const checkUserExist = await db.query('SELECT * FROM USERS WHERE id = $1', [
    id_user
  ]);

  if (checkUserExist.rowCount > 0) {
    const nameUser = await db
      .query('SELECT name from users where id = $1', [id_user])
      .then((res) => {
        return res.rows[0].name;
      });

    const checkLicenseUser = await db.query(
      'SELECT COUNT(*) FROM LICENSES WHERE id_user = $1',
      [id_user]
    );

    // verificar se existe a licença para o usuário, caso existir ele apenas atualiza as datas da licença
    if (checkLicenseUser) {
      //atualiza licença
      await db
        .query(
          'UPDATE licenses SET licensed_to = $1,created_on = $2 , licensed_from = $3 where id_user = $4',
          [licensed_to, date, licensed_from, id_user]
        )
        .then(
          () =>
            (msg = `Licensa atualizada com sucesso para o usuário ${nameUser}`)
        )
        .catch((err) => {
          isError = true;
          return (msg = err);
        });
    } else {
      // insere nova licença
      await db
        .query(
          'INSERT INTO licenses (licensed_to, licensed_from, is_lincensed,created_on, id_user) VALUES ($1, $2, $3, $4, $5)',
          [licensed_to, licensed_from, is_lincensed, date, id_user]
        )
        .then(() => {
          msg = `Licensa adicionada com sucesso para o usuário ${nameUser}`;
        })
        .catch((err) => {
          isError = true;
          msg = err;
        });
    }
  } else {
    isError = true;
    msg = 'Usuário não existe, favor verifique!';
  }
  res.status(isError ? 404 : 200).send({
    message: msg
  });
};

export = {
  createLicense
};
