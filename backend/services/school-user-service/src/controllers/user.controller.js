import { getCurrentUserProfile, getTeacherClass, getUsersForNotifications } from "../services/user.service.js";

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

export const getNotificationRecipients = async (req, res) => {
  if (req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY) {
    return res.status(401).json({ success: false, message: "Invalid internal service key" });
  }
  const roles = String(req.query.roles || "").split(",").filter(Boolean);
  const users = await getUsersForNotifications(req.query.schoolId || null, roles);
  return res.json({ success: true, data: users });
};