export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "assignment-service",
    status: "UP",
  });
};