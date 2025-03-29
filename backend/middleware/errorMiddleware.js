module.exports = (err, req, res, next) => {
  console.error("Error Middleware:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
};
