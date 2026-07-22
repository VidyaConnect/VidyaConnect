export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "notification-service",
    status: "UP",
  });
};