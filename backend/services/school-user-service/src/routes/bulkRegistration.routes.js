import { Router } from 'express';
import { auth } from '@vidyaconnect/shared';
import { requireSchoolAdmin } from '../middleware/requireSchoolAdmin.middleware.js';
import { bulkUpload } from '../middleware/bulkUpload.middleware.js';
import * as controller from '../controllers/bulkRegistration.controller.js';

const router = Router();

// 1) valid token, 2) a school admin of a school
router.use(auth, requireSchoolAdmin);

router.get('/status', controller.status);
router.get('/:type/template', controller.downloadTemplate);
router.post('/:type/validate', bulkUpload, controller.validate);
router.post('/:type/commit', bulkUpload, controller.commit);

export default router;