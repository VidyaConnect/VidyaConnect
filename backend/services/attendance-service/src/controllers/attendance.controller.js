import * as attendanceService from "../services/attendance.service.js";

function handleError(res, error) {
  return res.status(error.status || 500).json({
    success: false,
    message: error.message,
  });
}

export async function getSummary(req, res) {
  try {
    const data = await attendanceService.getTeacherSummary(
      req.user,
      req.query.classId
    );
    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getRoster(req, res) {
  try {
    const data = await attendanceService.getTeacherRoster(
      req.user,
      req.query.classId
    );
    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function markStudent(req, res) {
  try {
    const data = await attendanceService.markStudentAttendance(
      req.user,
      req.params.studentId,
      req.body.status
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getAdminOverview(req, res) {
  try {
    const data = await attendanceService.getAdminOverview(req.user);
    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getAdminClassRoster(req, res) {
  try {
    const data = await attendanceService.getAdminClassRoster(
      req.user,
      req.params.classId
    );
    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getParentAlert(req, res) {
  try {
    const data = await attendanceService.getParentAbsenceAlert(req.user);
    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function submitAbsenceReason(req, res) {
  try {
    const data = await attendanceService.submitAbsenceReason(req.user, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getHistory(req, res) {
  try {
    const data = await attendanceService.getStudentAttendanceHistory(
      req.user,
      req.params.studentId
    );
    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function linkDocument(req, res) {
  try {
    const data = await attendanceService.linkAbsenceDocument(req.user, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}