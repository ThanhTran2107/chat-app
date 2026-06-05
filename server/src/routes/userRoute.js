import express from "express";
import { authMe } from "../controllers/userController.js";
import { searchUserByUsername } from "../controllers/userController.js";

export const userRoute = express.Router();

userRoute.get("/me", authMe);
userRoute.get("/search", searchUserByUsername);
