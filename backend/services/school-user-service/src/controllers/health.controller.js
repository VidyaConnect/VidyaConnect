export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "school-user-service",
    status: "UP",
  });
};