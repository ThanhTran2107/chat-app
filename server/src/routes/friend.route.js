import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friend.controller.js";
import {
  validateSendFriendRequest,
  validateFriendRequestParam,
} from "../validators/friend.validator.js";
import { sensitiveRateLimiter } from "../middlewares/rate-limit.middleware.js";

export const friendRoute = express.Router();

friendRoute.post(
  "/request",
  sensitiveRateLimiter,
  validateSendFriendRequest,
  sendFriendRequest,
);

friendRoute.post(
  "/request/:requestId/accept",
  validateFriendRequestParam,
  acceptFriendRequest,
);

friendRoute.post(
  "/request/:requestId/decline",
  validateFriendRequestParam,
  declineFriendRequest,
);

friendRoute.get("/get-all", getAllFriends);
friendRoute.get("/requests", getFriendRequests);
