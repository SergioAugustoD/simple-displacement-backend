import express from 'express';
import licensesController from '../controllers/licenses.controller';

const app = express();

// responsável por setar as rotas das licensas.
app.post('/license-add', licensesController.createLicense);

export default {
  app
};
