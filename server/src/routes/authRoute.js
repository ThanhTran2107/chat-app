import express from "express";
import { register } from "../controllers/authController.js";

export const authRoute = express.Router();

authRoute.post("/register", register);
