import * as fileService from "../services/file.service.js";

function handleError(res, error) {
  return res.status(error.status || 500).json({
    success: false,
    message: error.message,
  });
}

export async function getUploadUrl(req, res) {
  try {
    const data = await fileService.generateUploadUrl(req.user, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getDownloadUrl(req, res) {
  try {
    const data = await fileService.generateDownloadUrl(req.user, req.params.fileId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function confirmUpload(req, res) {
  try {
    const data = await fileService.confirmUpload(req.user, req.params.fileId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getFile(req, res) {
  try {
    const data = await fileService.getFileMetadata(req.user, req.params.fileId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function listFiles(req, res) {
  try {
    const data = await fileService.listFiles(req.user, {
      purpose: req.query.purpose,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteFile(req, res) {
  try {
    const data = await fileService.deleteFile(req.user, req.params.fileId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
}