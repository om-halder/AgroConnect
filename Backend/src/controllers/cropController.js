import { analyzeCropImage } from "../services/openaiVisionService.js";

export const analyzeCropProblem = async (req, res) => {
  try {
    const { crop } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const base64Image = req.file.buffer.toString("base64");

    const result = await analyzeCropImage(base64Image, crop);

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to analyze crop" });
  }
};
