import express from "express";
import upload from "../middlewares/upload.js";
import { analyzeCropProblem } from "../controllers/cropController.js";

const router = express.Router();

router.post(
  "/analyze",
  upload.single("image"),
  analyzeCropProblem
);

export default router;
