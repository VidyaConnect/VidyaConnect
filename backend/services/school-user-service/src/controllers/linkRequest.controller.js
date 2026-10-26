import {
  createLinkRequest,
  listMyLinkRequests,
  listMyChildren,
} from "../services/linkRequest.service.js";
import {
  listPending,
  getDocument,
  reviewRequest,
  revertRequest,
} from "../services/linkReview.service.js";

const NIC_REGEX = /^(\d{9}[vVxX]|\d{12})$/;
const RELATIONSHIPS = ["FATHER", "MOTHER", "GUARDIAN"];

const fail = (res, error) =>
  res.status(error.statusCode || 500).json({ success: false, message: error.message });

export const create = async (req, res) => {
  try {
    const { admissionNo, schoolName, censusNo, nic, relationship } = req.body;
    const rel = String(relationship || "").toUpperCase();

    if (!admissionNo?.trim() || !schoolName?.trim() || !censusNo?.trim()) {
      return res.status(400).json({ success: false, message: "Please fill in all the child details." });
    }
    if (!NIC_REGEX.test((nic || "").trim())) {
      return res.status(400).json({ success: false, message: "Invalid NIC number." });
    }
    if (!RELATIONSHIPS.includes(rel)) {
      return res.status(400).json({ success: false, message: "Invalid relationship." });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Birth certificate is required." });
    }

    const data = await createLinkRequest(
      req.user.userId,
      {
        admissionNumber: admissionNo.trim().toUpperCase(),
        schoolName: schoolName.trim(),
        censusNumber: censusNo.trim(),
        nic: nic.trim().toUpperCase(),
        relationship: rel,
      },
      req.file
    );

    res.status(201).json({
      success: true,
      message: "Link request submitted for verification.",
      data,
    });
  } catch (error) {
    fail(res, error);
  }
};

export const listMine = async (req, res) => {
  try {
    res.json({ success: true, data: await listMyLinkRequests(req.user.userId) });
  } catch (error) {
    fail(res, error);
  }
};

export const listChildren = async (req, res) => {
  try {
    res.json({ success: true, data: await listMyChildren(req.user.userId) });
  } catch (error) {
    fail(res, error);
  }
};

export const pending = async (req, res) => {
  try {
    res.json({ success: true, data: await listPending(req.user.userId, req.query.status) });
  } catch (error) {
    fail(res, error);
  }
};

export const document = async (req, res) => {
  try {
    const { stream, contentType } = await getDocument(req.user.userId, req.params.id);
    res.setHeader("Content-Type", contentType || "application/octet-stream");
    res.setHeader("Content-Disposition", "inline");
    stream.on("error", () => res.end());
    stream.pipe(res);
  } catch (error) {
    fail(res, error);
  }
};

export const approve = async (req, res) => {
  try {
    const data = await reviewRequest(req.user.userId, req.params.id, "APPROVED");
    res.json({ success: true, message: "Request approved.", data });
  } catch (error) {
    fail(res, error);
  }
};

export const reject = async (req, res) => {
  try {
    const data = await reviewRequest(req.user.userId, req.params.id, "REJECTED", req.body.reason);
    res.json({ success: true, message: "Request rejected.", data });
  } catch (error) {
    fail(res, error);
  }
};

export const revert = async (req, res) => {
  try {
    const data = await revertRequest(req.user.userId, req.params.id);
    res.json({ success: true, message: "Request moved back to review.", data });
  } catch (error) {
    fail(res, error);
  }
};
