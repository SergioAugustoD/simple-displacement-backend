import app from './src/app';

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log('Aplicação executando na porta ', port);
});
