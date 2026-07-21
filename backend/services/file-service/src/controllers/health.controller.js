export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "file-service",
    status: "UP",
  });
};