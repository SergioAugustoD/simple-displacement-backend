import { Router } from 'express';

import { LicenseController } from '../controllers/licenses.controller';

const licenseRouter = Router();

licenseRouter.post('/license-add', LicenseController.createLicense);

export { licenseRouter };
