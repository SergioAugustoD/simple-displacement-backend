import cors from 'cors';
import express from 'express';

import index from './routes/index';
import licensesRoutes from './routes/licenses.routes';
import usersRoutes from './routes/users.routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use(index);
app.use('/api', usersRoutes.app);
app.use('/api', licensesRoutes.app);

export default app;
