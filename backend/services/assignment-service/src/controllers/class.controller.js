import { getTeacherClass } from "../clients/schoolUser.client.js";

export async function getTeacherClasses(req, res, next) {
  try {
    const assignedClass = await getTeacherClass(req.user, req.headers.authorization);
    res.json({ success: true, data: assignedClass ? [assignedClass] : [] });
  } catch (error) { next(error); }
}
