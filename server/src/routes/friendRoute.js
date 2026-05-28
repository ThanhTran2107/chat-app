import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friendController.js";

export const friendRoute = express.Router();

friendRoute.post("/request", sendFriendRequest);

friendRoute.post("/request/:requestId/accept", acceptFriendRequest);
friendRoute.post("/request/:requestId/decline", declineFriendRequest);

friendRoute.get("/get-all", getAllFriends);
friendRoute.get("/requests", getFriendRequests);
