import express from "express";
import { register } from "../controllers/authController.js";
import { logIn } from "../controllers/authController.js";
import { googleLogin } from "../controllers/authController.js";
import { facebookLogin } from "../controllers/authController.js";
import { logOut } from "../controllers/authController.js";
import { refreshToken } from "../controllers/authController.js";

export const authRoute = express.Router();

authRoute.post("/register", register);

authRoute.post("/login", logIn);

authRoute.post("/google", googleLogin);

authRoute.post("/facebook", facebookLogin);

authRoute.post("/logout", logOut);

authRoute.post("/refresh", refreshToken);
