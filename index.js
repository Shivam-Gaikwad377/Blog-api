import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/db/index.js";

import app from "./src/app.js";


connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});