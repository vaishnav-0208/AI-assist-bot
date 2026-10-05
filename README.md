# Real AI Chat

A browser-based chat app powered by Google's Gemini API through a Node.js and Express backend.

## Requirements

- Node.js
- A Gemini API key from Google AI Studio

## Setup

Install dependencies:

```powershell
npm install
```

Copy `.env.example` to `.env` and add your key:

```text
GEMINI_API_KEY=your_gemini_api_key
```

Start the app:

```powershell
npm start
```

Open http://localhost:3000.

The backend uses `gemini-3.5-flash-lite` by default. Set `GEMINI_MODEL` in `.env` to choose another model available to your API key.

Keep API keys in `.env`; never put them in frontend code or commit `.env` to Git.
