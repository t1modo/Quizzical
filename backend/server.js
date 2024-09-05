require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define a POST endpoint to generate questions
app.post('/generate-questions', async (req, res) => {
  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({ error: 'Notes are required' });
  }

  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003', // Or another model you prefer
      prompt: `Given the following notes, generate relevant study questions:\n\n${notes}\n\nQuestions:`,
      max_tokens: 150,
    });

    const questions = response.choices[0].text.trim();
    return res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: 'An error occurred while generating questions' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
