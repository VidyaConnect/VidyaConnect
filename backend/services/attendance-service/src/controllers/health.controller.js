export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "attendance-service",
    status: "UP",
  });
};