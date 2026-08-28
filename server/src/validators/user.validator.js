import { body, query } from "express-validator";
import { handleValidationErrors } from "./index.js";

export const validateSearchUser = [
  query("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Username must be between 1 and 30 characters"),
  handleValidationErrors,
];

export const validateUpdateProfile = [
  body("displayName")
    .optional()
    .isString()
    .withMessage("Display name must be a string")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Display name must not exceed 50 characters"),
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .toLowerCase(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone number must be a string")
    .trim(),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),
  body("showOnlineStatus")
    .optional()
    .isBoolean()
    .withMessage("showOnlineStatus must be a boolean")
    .toBoolean(),
  handleValidationErrors,
];
