import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

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
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Access token missing" });

    const decodedUser = await verifyAccessToken(token);

    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword",
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
