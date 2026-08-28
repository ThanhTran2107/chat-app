import { body, param } from "express-validator";
import { handleValidationErrors } from "./index.js";

export const validateSendDirectMessage = [
  body("recipientId")
    .notEmpty()
    .withMessage("Recipient ID is required")
    .isString()
    .withMessage("Recipient ID must be a string")
    .isLength({ min: 24, max: 24 })
    .withMessage("Recipient ID must be a valid 24-character string"),
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Content must not exceed 5000 characters"),
  body("conversationId")
    .optional()
    .isString()
    .withMessage("Conversation ID must be a string")
    .isLength({ min: 24, max: 24 })
    .withMessage("Conversation ID must be a valid 24-character string"),
  body("clientMessageId")
    .optional()
    .isString()
    .withMessage("Client message ID must be a string"),
  body("createdAt")
    .optional()
    .isString()
    .withMessage("Created at must be a string"),
  body("clientSequence")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Client sequence must be a non-negative integer")
    .toInt(),
  body("clientGroupId")
    .optional()
    .isString()
    .withMessage("Client group ID must be a string"),
  handleValidationErrors,
];

export const validateSendGroupMessage = [
  body("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .isString()
    .withMessage("Conversation ID must be a string")
    .isLength({ min: 24, max: 24 })
    .withMessage("Conversation ID must be a valid 24-character string"),
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Content must not exceed 5000 characters"),
  body("clientMessageId")
    .optional()
    .isString()
    .withMessage("Client message ID must be a string"),
  body("createdAt")
    .optional()
    .isString()
    .withMessage("Created at must be a string"),
  body("clientSequence")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Client sequence must be a non-negative integer")
    .toInt(),
  body("clientGroupId")
    .optional()
    .isString()
    .withMessage("Client group ID must be a string"),
  handleValidationErrors,
];

export const validateMessageParam = [
  param("messageId")
    .notEmpty()
    .withMessage("Message ID is required")
    .isString()
    .withMessage("Message ID must be a string")
    .isLength({ min: 24, max: 24 })
    .withMessage("Message ID must be a valid 24-character string"),
  handleValidationErrors,
];
