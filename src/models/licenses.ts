import { dbQuery } from '../config/database';
import { Licenses } from '../types/License';

const checkIsLicensedUser = async (login: string) => {
  const isLicensed = await dbQuery(
    'SELECT * FROM LICENSES LC INNER JOIN USERS US ON US.id = LC.id_user where US.login = ? and NOW() between licensed_to and licensed_from',
    [login]
  );

  return isLicensed;
};

const createLicense = async (license: Licenses) => {
  let msg = '';
  let isError = false;

  const date = new Date();

  const checkUserExist = await dbQuery('SELECT * FROM USERS WHERE id = ?', [
    license.id_user
  ]);

  if (checkUserExist.length > 0) {
    const nameUser = await dbQuery('SELECT name from users where id = ?', [
      license.id_user
    ]).then((res) => {
      return res[0].name;
    });

    const checkLicenseUser = await dbQuery(
      'SELECT COUNT(*) as count FROM LICENSES WHERE id_user = ?',
      [license.id_user]
    );

    // verificar se existe a licença para o usuário, caso existir ele apenas atualiza as datas da licença
    if (checkLicenseUser[0].count > 0) {
      //atualiza licença
      await dbQuery(
        'UPDATE licenses SET licensed_to = ?,created_on = ? , licensed_from = ? where id_user = ?',
        [license.licensed_to, date, license.licensed_from, license.id_user]
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
      await dbQuery(
        'INSERT INTO licenses (licensed_to, licensed_from, is_licensed,created_on, id_user) VALUES (?,?,?,?,?)',
        [
          license.licensed_to,
          license.licensed_from,
          true,
          date,
          license.id_user
        ]
      )
        .then(() => {
          msg = `Licensa adicionada com sucesso para o usuário ${nameUser}`;
        })
        .catch((err) => {
          console.log(license.id_user);
          isError = true;
          msg = err;
        });
    }
  } else {
    isError = true;
    msg = 'Usuário não existe, favor verifique!';
  }
  return {
    err: isError,
    message: msg
  };
};

export const licenseModel = {
  createLicense,
  checkIsLicensedUser
};
