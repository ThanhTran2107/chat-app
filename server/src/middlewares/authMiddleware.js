import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// function để xác nhận access token
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
    // lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token)
      return res.status(401).json({ message: "Access token missing" });

    // xác nhận token hợp lệ
    const decodedUser = await verifyAccessToken(token);

    // tìm user
    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword", // không trả về hashedPassword
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // trả user về trong request
    req.user = user;
    next(); // tiếp tục xử lý request
  } catch (e) {
    console.error('Protected route error:', e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
