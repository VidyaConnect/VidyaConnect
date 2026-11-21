import { Router } from 'express';
import { auth } from '@vidyaconnect/shared';
import { requireSchoolAdmin } from '../middleware/requireSchoolAdmin.middleware.js';
import * as c from '../controllers/academics.controller.js';

const router = Router();

// 1) valid token, 2) a school admin of a school
router.use(auth, requireSchoolAdmin);

router.get('/teachers', c.listTeachers);
router.delete('/teachers/:teacherId', c.removeTeacher);
router.post('/teachers/:teacherId/teaching', c.addTeaching);
router.delete('/teaching/:assignmentId', c.removeTeaching);

router.get('/classes', c.listClasses);
router.post('/classes', c.createClass);
router.post('/classes/bulk', c.createClasses);
router.put('/classes/:classId/class-teacher', c.setClassTeacher);
router.delete('/classes/:classId', c.deleteClass);

export default router;