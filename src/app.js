import express from "express";
import userRoutes from "./routes/user.route.js";

const app = express();

//routes declaration
app.use("/api/v1/users", userRoutes);
export default app;