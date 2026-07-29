const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

const validateSignup = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { isValid: false, message: "Payload missing or invalid" };
  }

  const { username, email, password, role } = payload;

  if (!username || typeof username !== "string" || !username.trim()) {
    return { isValid: false, message: "Username is required" };
  }

  if (!email || !validateEmail(email)) {
    return { isValid: false, message: "Valid email is required" };
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return {
      isValid: false,
      message: "Password is required and must be at least 6 characters long",
    };
  }

  const validRoles = ["customer", "seller", "driver", "admin"];
  if (role && !validRoles.includes(role)) {
    return { isValid: false, message: "Invalid user role specified" };
  }

  return { isValid: true };
};

const validateLogin = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { isValid: false, message: "Payload missing or invalid" };
  }

  const { email, password } = payload;

  if (!email || !validateEmail(email)) {
    return { isValid: false, message: "Valid email is required" };
  }

  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }

  return { isValid: true };
};

module.exports = {
  validateEmail,
  validateSignup,
  validateLogin,
};