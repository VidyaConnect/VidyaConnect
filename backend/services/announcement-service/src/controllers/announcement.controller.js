import { createNewAnnouncement } from "../services/announcement.service.js";

export const createAnnouncement = async (req, res) => {

  try {

    const announcement = await createNewAnnouncement(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      data: announcement,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};