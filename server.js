require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function askGemini(message) {
  const systemInstruction =
    "You are a helpful AI assistant. Give clear, friendly answers. Keep explanations simple, structured, and beginner-friendly.";

  try {
    console.log(`Sending request to ${MODEL_NAME}...`);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    return response.text || "I could not generate a response right now.";
  } catch (error) {
    console.log(`Model failed with status ${error.status || "unknown"}`);

    if (error.status === 429 || error.status === 503) {
      await sleep(1500);
      const retryResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      return retryResponse.text || "I could not generate a response right now.";
    }

    throw error;
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true, model: MODEL_NAME });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const reply = await askGemini(message);

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      error: "The AI service is temporarily unavailable. Please try again in a moment."
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI Chat running at http://localhost:${PORT}`);
});