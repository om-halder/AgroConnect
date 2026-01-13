import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cropRoutes from "./routes/cropRoutes.js";
import authRoutes from "./routes/authRoutes.js";



const app = express();

app.use(cors());
app.use(express.json());
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch((err) => console.log(err));
