import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import { useRoutes } from './routes/index';

const PORT = process.env.PORT || 8091;
const app = express();

app.use(bodyParser.json());
app.use(cors());
// eslint-disable-next-line react-hooks/rules-of-hooks
useRoutes(app);

app.listen(PORT, () => console.log('Servidor iniciado na porta ' + PORT));
