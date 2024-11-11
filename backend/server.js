require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  })
);

// In-memory storage for parsed question-answer pairs
let questionAnswerPairs = [];

// Helper function to parse questions and answers from input text
function parseNotesToQA(notes) {
  const pairs = [];
  const lines = notes
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);

  let currentQuestions = [];
  let currentAnswer = '';
  let isQuestion = true;

  for (let line of lines) {
    if (isQuestion && line.endsWith('?')) {
      currentQuestions.push(line);
    } else if (isQuestion) {
      isQuestion = false;
      currentAnswer = line;
    } else {
      currentAnswer += ` ${line}`;
    }

    if (!isQuestion && (line.endsWith('?') || line === lines[lines.length - 1])) {
      pairs.push({
        questions: [...currentQuestions],
        answer: currentAnswer.trim(),
      });

      currentQuestions = [];
      currentAnswer = '';
      isQuestion = line.endsWith('?');
    }
  }

  return pairs;
}

// Endpoint to parse and store questions and answers
app.post('/parse-questions', (req, res) => {
  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({ error: 'Notes are required' });
  }

  questionAnswerPairs = parseNotesToQA(notes);
  res.json({
    message: 'Questions and answers parsed successfully',
    questionAnswerPairs,
  });
});

// Endpoint to check all answers at once
app.post('/check-answers', async (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'Answers are required' });
  }

  try {
    const feedback = [];

    // Iterate through all answers and grade them
    for (const index in answers) {
      const pair = questionAnswerPairs[index];
      if (!pair) continue;

      const question = pair.questions[0];
      const correctAnswer = pair.answer;
      const userAnswer = answers[index];

      console.log(`Grading question: "${question}" with user's answer: "${userAnswer}"`);

      // Call OpenAI API directly with axios, using gpt-3.5-turbo
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // Changed to gpt-3.5-turbo
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that grades student answers. Provide a score out of 100 and a brief feedback message.',
            },
            {
              role: 'user',
              content: `Question: "${question}"\nCorrect Answer: "${correctAnswer}"\nUser's Answer: "${userAnswer}"\n\nEvaluate the user's answer for correctness, completeness, and relevance. Provide a score out of 100 and a brief feedback message.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.5,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      feedback[index] = {
        question,
        feedback: response.data.choices[0]?.message?.content.trim() || 'No feedback generated',
      };
    }

    console.log("Final feedback:", feedback);
    res.json({ feedback });
  } catch (error) {
    if (error.response) {
      console.error('OpenAI API Error:', error.response.data); // Log detailed error response from OpenAI
      res.status(500).json({ error: error.response.data }); // Send error details to the client
    } else {
      console.error('Server Error:', error.message || error);
      res.status(500).json({ error: 'An error occurred while grading answers' });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
