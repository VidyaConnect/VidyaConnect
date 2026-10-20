import { successResponse, errorResponse } from "@vidyaconnect/shared";
import { getMyProfile } from "../services/profile.service.js";

export const getMyProfileController = async (req, res) => {
  try {
    const profile = await getMyProfile(req.user.userId);
    return successResponse(res, profile, "Profile retrieved");
  } catch (err) {
    if (err.status) return errorResponse(res, err.message, err.status);
    console.error("getMyProfile failed:", err);
    return errorResponse(res, "Something went wrong", 500);
  }
};
