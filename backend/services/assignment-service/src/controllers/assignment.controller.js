import * as service from "../services/assignment.service.js";

const run = (handler) => async (req, res, next) => {
  try { res.json({ success: true, data: await handler(req) }); }
  catch (error) { next(error); }
};

export const listAssignments = run(service.listAssignments);
export const getAssignment = run(service.getAssignment);
export const createAssignment = run(service.createAssignment);
export const publishAssignment = run(service.publishAssignment);
export const updateStudentStatus = run((req) => service.updateStudentStatus(req, req.params.studentId));

