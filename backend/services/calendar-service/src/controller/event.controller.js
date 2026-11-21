import * as eventService from "../services/event.service.js";
import { AppError } from "../services/event.service.js";

// Wraps each handler so thrown errors become proper JSON responses
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof AppError) {
      return res
        .status(err.statusCode)
        .json({ message: err.message, ...(err.details ?? {}) });
    }
    console.error("Calendar service error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// req.user plus the raw Authorization header, so we can call
// school-user-service on the user's behalf
const userOf = (req) => ({
  ...req.user,
  authHeader: req.headers.authorization,
});

// GET /calendar/events?from=...&to=...
export const listEvents = handle(async (req, res) => {
  const { from, to } = req.query;
  const events = await eventService.listEvents(userOf(req), from, to);
  res.json(events);
});

// POST /calendar/events/conflicts
export const checkConflicts = handle(async (req, res) => {
  const { excludeId, ...input } = req.body;
  const overlaps = await eventService.checkConflicts(userOf(req), input, excludeId);
  res.json(overlaps);
});

// POST /calendar/events
export const createEvent = handle(async (req, res) => {
  const { confirmOverlap, ...input } = req.body;
  const event = await eventService.createEvent(
    userOf(req),
    input,
    Boolean(confirmOverlap)
  );
  res.status(201).json(event);
});

// PUT /calendar/events/:id
export const updateEvent = handle(async (req, res) => {
  const { confirmOverlap, ...input } = req.body;
  const event = await eventService.updateEvent(
    userOf(req),
    req.params.id,
    input,
    Boolean(confirmOverlap)
  );
  res.json(event);
});

// DELETE /calendar/events/:id
export const deleteEvent = handle(async (req, res) => {
  await eventService.deleteEvent(userOf(req), req.params.id);
  res.status(204).send();
});