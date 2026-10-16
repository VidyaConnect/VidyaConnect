import { getCurrentSchoolContext, registerSchool } from "../services/school.service.js";

export const getCurrentSchool = async (req, res) => {
  try {
    const school = await getCurrentSchoolContext(req.user.schoolId);

    res.status(200).json({
      success: true,
      data: school,
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};

export const register = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Verification document is required",
      });
    }

    const verificationDocUrl = `/uploads/verification-docs/${req.file.filename}`;
    const result = await registerSchool(req.body, verificationDocUrl);

    res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error) {
    const status = error.statusCode || 500;

    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};