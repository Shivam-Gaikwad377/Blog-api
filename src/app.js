import express from "express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/posts.route.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

const app = express();

app.use(
  express.json({
    limit: "20kb",
  }),
);
app.use(
  express.urlencoded({
    limit: "20kb",
    extended: true,
  }),
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.static("../uploads"));
app.use(cookieParser());

//routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
export default app;
