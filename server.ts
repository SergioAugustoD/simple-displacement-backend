import app from './src/app';

const port = 8091;

app.listen(port, () => {
  console.log('Aplicação executando na porta ', port);
});
