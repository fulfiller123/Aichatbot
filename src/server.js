const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const API_KEY = "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";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const ORGANIZATION_ID = "org-KF7EcWtdVCcVZ40bBwgdM4qT";

app.post('/ask', async (req, res) => {
  const { messages } = req.body;

  const systemMessage = {
    role: "system",
    content: "Welcome to the AI ChatBot! Feel free to ask me anything."
  };

  const apiMessages = messages.map((messageObject) => {
    const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
    return { role, content: messageObject.message };
  });

  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      systemMessage,
      ...apiMessages
    ]
  };

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Organization": ORGANIZATION_ID
      },
      body: JSON.stringify(apiRequestBody)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API.");
    }

    const data = await response.json();

    const chatGptResponse = data.choices[0].message.content;

    res.json({ response: chatGptResponse });
  } catch (error) {
    console.error("Error processing ChatGPT response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
