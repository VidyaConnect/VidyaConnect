import { getCurrentUserProfile } from "../services/user.service.js";

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