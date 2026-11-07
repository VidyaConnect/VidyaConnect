import {
  closeForm,
  createForm,
  getForm,
  listForms,
  listResponses,
  publishForm,
  respondToForm,
  updateDraft,
} from "../services/consent-form.service.js";

function sendError(res, error) {
  console.error("Consent form request failed:", error);
  return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error" });
}

export async function list(req, res) {
  try { return res.json({ success: true, data: await listForms(req.user) }); } catch (error) { return sendError(res, error); }
}

export async function detail(req, res) {
  try { return res.json({ success: true, data: await getForm(req.params.id, req.user) }); } catch (error) { return sendError(res, error); }
}

export async function create(req, res) {
  try { return res.status(201).json({ success: true, data: await createForm(req.body, req.user) }); } catch (error) { return sendError(res, error); }
}

export async function update(req, res) {
  try { return res.json({ success: true, data: await updateDraft(req.params.id, req.body, req.user) }); } catch (error) { return sendError(res, error); }
}

export async function publish(req, res) {
  try { return res.json({ success: true, data: await publishForm(req.params.id, req.user) }); } catch (error) { return sendError(res, error); }
}

export async function close(req, res) {
  try { return res.json({ success: true, data: await closeForm(req.params.id, req.user) }); } catch (error) { return sendError(res, error); }
}

export async function responses(req, res) {
  try { return res.json({ success: true, data: await listResponses(req.params.id, req.user) }); } catch (error) { return sendError(res, error); }
}

export async function respond(req, res) {
  try { return res.json({ success: true, data: await respondToForm(req.params.id, req.body, req.user) }); } catch (error) { return sendError(res, error); }
}
