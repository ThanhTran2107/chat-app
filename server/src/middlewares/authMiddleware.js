import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// verifies an access token
const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(err);

      resolve(decoded);
    });
  });
};

export const protectedRoute = async (req, res, next) => {
  try {
    // get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token)
      return res.status(401).json({ message: "Access token missing" });

    // validate the token
    const decodedUser = await verifyAccessToken(token);

    // find the user
    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword", // do not return hashedPassword
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // attach user to the request
    req.user = user;
    next(); // continue processing the request
  } catch (error) {
    console.error("Protected route error:", error);

    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "Access token expired" });

    return res.status(401).json({ message: "Invalid access token" });
  }
};
