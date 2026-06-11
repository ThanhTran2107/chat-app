import express from "express";
import {
  register,
  logIn,
  logOut,
  refreshToken,
  googleLogin,
  facebookLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

export const authRoute = express.Router();

authRoute.post("/register", register);

authRoute.post("/login", logIn);

authRoute.post("/google", googleLogin);

authRoute.post("/facebook", facebookLogin);

authRoute.post("/logout", logOut);

authRoute.post("/refresh", refreshToken);

authRoute.post("/forgot-password", forgotPassword);

authRoute.post("/reset-password", resetPassword);
