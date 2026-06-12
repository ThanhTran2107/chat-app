import "dotenv/config";
import express from "express";
import { connectDB } from "./libs/db.js";
import { authRoute } from "./routes/authRoute.js";
import { userRoute } from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import { friendRoute } from "./routes/friendRoute.js";
import { messageRoute } from "./routes/messageRoute.js";
import { conversationRoute } from "./routes/conversationRoute.js";
import SwaggerUI from "swagger-ui-express";
import fs from "fs";
import { app, httpServer } from "./sockets/index.js";
import { v2 as cloudinary } from "cloudinary";

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Swagger setup
const swaggerDocument = JSON.parse(
  fs.readFileSync("./src/swagger.json", "utf-8"),
);

app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

// Public route
app.use("/chat-app/auth", authRoute);

// Private route
app.use(protectedRoute);
app.use("/chat-app/user", userRoute);
app.use("/chat-app/friend", friendRoute);
app.use("/chat-app/message", messageRoute);
app.use("/chat-app/conversation", conversationRoute);

connectDB().then(() =>
  httpServer.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`),
  ),
);
