import { Router } from 'express';
import { loginController, refreshController, registerParentController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/register/parent', registerParentController);

export default router;