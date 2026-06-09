import express from "express";
import { authMe } from "../controllers/userController.js";
import { searchUserByUsername } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";
import { deleteProfile } from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { uploadAvatar } from "../controllers/userController.js";

export const userRoute = express.Router();

userRoute.get("/me", authMe);
userRoute.patch("/me", updateProfile);
userRoute.delete("/me", deleteProfile);
userRoute.get("/search", searchUserByUsername);
userRoute.post("/uploadAvatar", upload.single("file"), uploadAvatar);
