const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { s3Client, S3_BUCKET } = require("../config/s3");

const getDownloadUrl = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        status: "error",
        message: "File key is required",
      });
    }

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return res.status(200).json({
      status: "success",
      downloadUrl,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Error generating signed download URL:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to generate signed download URL",
    });
  }
};

module.exports = {
  getDownloadUrl,
};