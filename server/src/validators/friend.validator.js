import { body, param } from "express-validator";
import { handleValidationErrors } from "./index.js";

export const validateSendFriendRequest = [
  body("to")
    .notEmpty()
    .withMessage("Recipient ID is required")
    .isString()
    .withMessage("Recipient ID must be a string")
    .isLength({ min: 24, max: 24 })
    .withMessage("Recipient ID must be a valid 24-character string"),
  body("message")
    .optional()
    .isString()
    .withMessage("Message must be a string")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Message must not exceed 300 characters"),
  handleValidationErrors,
];

export const validateFriendRequestParam = [
  param("requestId")
    .notEmpty()
    .withMessage("Request ID is required")
    .isString()
    .withMessage("Request ID must be a string")
    .isLength({ min: 24, max: 24 })
    .withMessage("Request ID must be a valid 24-character string"),
  handleValidationErrors,
];
