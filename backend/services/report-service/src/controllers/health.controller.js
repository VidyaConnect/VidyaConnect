export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "report-service",
    status: "UP",
  });
};