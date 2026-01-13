// src/services/openaiVisionService.js
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set
});

/**
 * Analyze crop leaf image
 * @param {Buffer} imageBuffer - Buffer of the uploaded image
 * @param {string} crop - Name of the crop
 * @returns {Object} JSON response with disease info
 */
export async function analyzeCropImage(imageBuffer, crop) {
  // Convert image buffer to base64
  const imageBase64 = imageBuffer.toString("base64");

  // Build strict prompt
  const prompt = `
You are an API, not a human.

Analyze this crop leaf image for disease.

STRICT RULES:
- Output ONLY valid JSON
- Do NOT add explanations
- Do NOT use markdown
- Do NOT add extra text

The crop name is: "${crop}"
The image is base64-encoded: "${imageBase64}"

JSON FORMAT:
{
  "crop": "",
  "disease": "",
  "confidence": "",
  "symptoms": [],
  "treatment": [],
  "prevention": []
}

If the leaf is rotten or diseased, identify the MOST LIKELY disease.
`;

  try {
    // Call OpenAI chat/completion API
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // fast and good for structured output
      messages: [
        { role: "system", content: "You are a crop disease analysis API." },
        { role: "user", content: prompt },
      ],
      temperature: 0, // deterministic output
    });

    const raw = response.choices[0].message.content;

    // Parse JSON safely
    let result;
    try {
      result = JSON.parse(raw);
    } catch (err) {
      result = { error: "AI response was not valid JSON", raw };
    }

    return result;
  } catch (err) {
    console.error("OpenAI API error:", err);
    return { error: "Failed to analyze crop image", details: err.message };
  }
}
