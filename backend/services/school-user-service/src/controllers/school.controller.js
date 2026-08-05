import { getCurrentSchoolContext } from "../services/school.service.js";

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