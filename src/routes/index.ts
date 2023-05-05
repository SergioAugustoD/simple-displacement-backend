import { Application, Router } from 'express';

import { licenseRouter } from './licenses';
import { userRouter } from './users';

export const useRoutes = (app: Application) => {
  const apiRouter = Router();

  apiRouter.use('/user', userRouter);
  apiRouter.use('/license', licenseRouter);

  app.use('/api/v1', apiRouter);
};
