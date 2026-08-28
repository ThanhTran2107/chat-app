import { body, param, query } from "express-validator";
import { handleValidationErrors } from "./index.js";

export const validateCreateConversation = [
  body("type")
    .notEmpty()
    .withMessage("Conversation type is required")
    .isIn(["direct", "group"])
    .withMessage("Conversation type must be direct or group"),
  body("name")
    .optional()
    .isString()
    .withMessage("Group name must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Group name must not exceed 100 characters"),
  body("memberIds")
    .optional()
    .isArray()
    .withMessage("Member IDs must be an array")
    .custom((ids) => ids.every((id) => typeof id === "string" && id.length === 24))
    .withMessage("Each member ID must be a valid 24-character string"),
  body("recipientId")
    .optional()
    .isString()
    .withMessage("Recipient ID must be a string"),
  handleValidationErrors,
];

export const validateGetMessages = [
  param("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .isString()
    .withMessage("Conversation ID must be a string"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100")
    .toInt(),
  query("cursor")
    .optional()
    .isString()
    .withMessage("Cursor must be a string"),
  handleValidationErrors,
];

export const validateConversationParam = [
  param("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .isString()
    .withMessage("Conversation ID must be a string"),
  handleValidationErrors,
];
