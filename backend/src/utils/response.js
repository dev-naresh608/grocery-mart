export const serverError = (
  res,
  error,
  altMessage = "Internal server error",
) => {
  return res.status(500).json({
    success: false,
    message: error?.message || altMessage,
  });
};

export const badRequest = (res, message = "Bad request") => {
  return res.status(400).json({
    success: false,
    message,
  });
};
