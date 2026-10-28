import { successResponse } from "@vidyaconnect/shared";
import * as service from "../services/communication.service.js";

export const getThread = async (req, res) =>
  successResponse(res, await service.getOrCreateThread(req.user, req.query.studentId));

export const listMessages = async (req, res) =>
  successResponse(res, await service.listMessages(req.user, req.params.id));

export const sendMessage = async (req, res) => {
  const message = await service.sendMessage(req.user, req.params.id, req.body);
  res.status(201).json({ success: true, message: "Message sent", data: message });
};

export const markRead = async (req, res) =>
  successResponse(res, await service.markRead(req.user, req.params.id));