const express = require('express');
const cors = require('cors');
const openai = require('openai');
const axios = require('axios'); // Import Axios

const app = express();
const port = 5000;

// Set up OpenAI API client
const openaiApi = new openai.OpenAIApi({ key: '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' }); // Replace with your OpenAI API key


app.use(cors());
app.use(express.json());

app.get('/chatgpt', async (req, res) => {
  try {
    const response = await openai.Completion.create({
      engine: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    res.json({ text: response.choices[0].text });
  } catch (error) {
    console.error('Error:', error);

    // Check if it's an Axios error
    if (axios.isAxiosError(error)) {
      const axiosErrorDetails = {
        isAxiosError: true,
        status: error.response ? error.response.status : null,
        data: error.response ? error.response.data : null,
      };
      res.status(500).json({ error: 'Internal Server Error', details: axiosErrorDetails });
    } else {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
