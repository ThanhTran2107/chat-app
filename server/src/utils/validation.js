import crypto from "crypto";

export const PASSWORD_MIN_LENGTH = 8;

export const validatePassword = (password) => {
  if (typeof password !== "string") return "Password is required";
  if (password.length < PASSWORD_MIN_LENGTH)
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?]/.test(password))
    return "Password must contain at least one special character";
  if (/\s/.test(password)) return "Password cannot contain spaces";

  return null;
};

export const normalizeEmail = (email) => email.toLowerCase().trim();

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const buildVerificationUrl = (token) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return `${clientUrl}${process.env.EMAIL_VERIFY_PATH || "/verify-email"}?token=${token}`;
};

export const buildPasswordResetUrl = (token) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return `${clientUrl}${process.env.PASSWORD_RESET_PATH || "/reset-password"}?token=${token}`;
};
