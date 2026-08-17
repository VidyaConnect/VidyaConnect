import * as attendanceService from "../services/attendance.service.js";

function handleError(res, error) {
  return res.status(error.status || 500).json({
    success: false,
    message: error.message,
  });
}

export async function markAttendance(req, res) {
  try {
    const data = await attendanceService.markAttendance(req.user, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getAttendanceByClass(req, res) {
  try {
    const data = await attendanceService.getAttendanceByClass(
      req.user,
      req.params.classId,
      req.query.date
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getStudentAttendance(req, res) {
  try {
    const data = await attendanceService.getStudentAttendance(
      req.user,
      req.params.studentId,
      {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      }
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function submitAbsenceResponse(req, res) {
  try {
    const data = await attendanceService.submitAbsenceResponse(req.user, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getAbsenceResponses(req, res) {
  try {
    const data = await attendanceService.getAbsenceResponses(
      req.user,
      req.params.studentId
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}
