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
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import {
  validateRegister,
  validateLogin,
  validateGoogleLogin,
  validateFacebookLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
  validateResendVerification,
} from "../validators/auth.validator.js";
import {
  authRateLimiter,
  refreshRateLimiter,
} from "../middlewares/rate-limit.middleware.js";

export const authRoute = express.Router();

authRoute.post("/register", authRateLimiter, validateRegister, register);

authRoute.post("/login", authRateLimiter, validateLogin, logIn);

authRoute.post("/google", authRateLimiter, validateGoogleLogin, googleLogin);

authRoute.post(
  "/facebook",
  authRateLimiter,
  validateFacebookLogin,
  facebookLogin,
);

authRoute.post("/logout", refreshRateLimiter, logOut);

authRoute.post("/refresh", refreshRateLimiter, refreshToken);

authRoute.post(
  "/forgot-password",
  authRateLimiter,
  validateForgotPassword,
  forgotPassword,
);

authRoute.post(
  "/reset-password",
  authRateLimiter,
  validateResetPassword,
  resetPassword,
);

authRoute.get(
  "/verify-email",
  authRateLimiter,
  validateVerifyEmail,
  verifyEmail,
);

authRoute.post(
  "/verify-email",
  authRateLimiter,
  validateVerifyEmail,
  verifyEmail,
);

authRoute.post(
  "/resend-verification",
  authRateLimiter,
  validateResendVerification,
  resendVerificationEmail,
);
