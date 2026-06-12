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
