import express from "express";
import { authMe } from "../controllers/user.controller.js";
import { searchUserByUsername } from "../controllers/user.controller.js";
import { updateProfile } from "../controllers/user.controller.js";
import { deleteProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadAvatar } from "../controllers/user.controller.js";
import {
  validateSearchUser,
  validateUpdateProfile,
} from "../validators/user.validator.js";

export const userRoute = express.Router();

userRoute.get("/me", authMe);

userRoute.patch("/me", validateUpdateProfile, updateProfile);

userRoute.delete("/me", deleteProfile);

userRoute.get("/search", validateSearchUser, searchUserByUsername);

userRoute.post("/uploadAvatar", upload.single("file"), uploadAvatar);
