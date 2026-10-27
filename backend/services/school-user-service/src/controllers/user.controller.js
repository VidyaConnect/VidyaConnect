import { getCurrentUserProfile, getTeacherClass, getTeacherClasses } from "../services/user.service.js";

export const getMe = async (req, res) => {
  try {
    const user = await getCurrentUserProfile(req.user.userId);

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyClass = async (req, res) => {
  try {
    const data = await getTeacherClass(req.user.userId);
    res.status(200).json(data);
    } catch (error) {
    console.error("getMyClass failed:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyClasses = async (req, res) => {
  try {
    const data = await getTeacherClasses(req.user.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getMyClasses failed:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
