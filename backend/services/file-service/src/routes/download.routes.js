const express = require("express");

const { getDownloadUrl } = require("../controllers/download.controller");

const router = express.Router();

router.get("/download-url", getDownloadUrl);

module.exports = router;