import { Router } from 'express';
import {
  loginController,
  refreshController,
  registerParentController,
  registerSchoolAdminController,
  meController,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/register/parent', registerParentController);
router.post('/register/school-admin', registerSchoolAdminController);
router.get('/me', meController);

export default router;