export const healthCheck = (req, res) => {
  res.status(200).json({
    service: "consent-form-service",
    status: "UP",
  });
};