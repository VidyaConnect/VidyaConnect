import { getTeacherClasses as fetchTeacherClasses } from "../clients/schoolUser.client.js";

export async function getTeacherClasses(req, res, next) {
  try {
    const assignedClasses = await fetchTeacherClasses(req.user, req.headers.authorization);
    res.json({ success: true, data: assignedClasses });
  } catch (error) { next(error); }
}
