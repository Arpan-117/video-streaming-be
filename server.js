import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//connect to db
connectDB();

//Routes
app.use("/api", userRoutes);
app.use("/api", channelRoutes);
app.use("/api", videoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});