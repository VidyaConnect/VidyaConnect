export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "announcement-service",
    status: "UP",
  });
};