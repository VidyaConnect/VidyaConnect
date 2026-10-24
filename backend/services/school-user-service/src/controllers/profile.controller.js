import { successResponse, errorResponse } from "@vidyaconnect/shared";
import { getMyProfile, updateMyProfile, changeMyPassword } from "../services/profile.service.js";

function handleError(res, err, label) {
  if (err.status) return errorResponse(res, err.message, err.status);
  console.error(`${label} failed:`, err);
  return errorResponse(res, "Something went wrong", 500);
}

export const getMyProfileController = async (req, res) => {
  try {
    return successResponse(res, await getMyProfile(req.user.userId), "Profile retrieved");
  } catch (err) {
    return handleError(res, err, "getMyProfile");
  }
};

export const updateMyProfileController = async (req, res) => {
  try {
    return successResponse(res, await updateMyProfile(req.user.userId, req.body), "Profile updated");
  } catch (err) {
    return handleError(res, err, "updateMyProfile");
  }
};

export const changeMyPasswordController = async (req, res) => {
  try {
    await changeMyPassword(req.user.userId, req.body);
    return successResponse(res, null, "Password changed successfully");
  } catch (err) {
    return handleError(res, err, "changeMyPassword");
  }
};
