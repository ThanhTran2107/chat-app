import "dotenv/config";
import express from "express";
import { connectDB } from "./libs/db.js";
import { authRoute } from "./routes/auth.route.js";
import { userRoute } from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/auth.middleware.js";
import cors from "cors";
import { friendRoute } from "./routes/friend.route.js";
import { messageRoute } from "./routes/message.route.js";
import { conversationRoute } from "./routes/conversation.route.js";
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

// Lightweight endpoint for uptime pingers (e.g. UptimeRobot/cron-job.org) to keep free-tier hosting awake
app.get("/health", (_, res) => res.status(200).json({ status: "ok" }));

// Swagger setup
const swaggerDocument = JSON.parse(
  fs.readFileSync("./src/swagger.json", "utf-8"),
);

app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

// Public route
app.use("/tetra/auth", authRoute);

// Private route
app.use(protectedRoute);
app.use("/tetra/user", userRoute);
app.use("/tetra/friend", friendRoute);
app.use("/tetra/message", messageRoute);
app.use("/tetra/conversation", conversationRoute);

connectDB().then(() =>
  httpServer.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`),
  ),
);
