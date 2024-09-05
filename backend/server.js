const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE', // Allow these methods
    allowedHeaders: 'Content-Type,Authorization', // Allow these headers
}));

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // Initial delay in milliseconds

async function makeApiRequest(url, data, headers, retries = MAX_RETRIES) {
    let retryCount = 0;
    while (retryCount < retries) {
        try {
            const response = await axios.post(url, data, { headers });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                retryCount++;
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                console.log(`Rate limited. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Max retries reached');
}

app.post('/ask', async (req, res) => {
    const { question, context } = req.body;

    if (!question || !context) {
        return res.status(400).json({ error: 'Question and context are required.' });
    }

    try {
        const data = {
            model: 'gpt-3.5-turbo', // Or 'gpt-4' if using GPT-4
            messages: [
                { role: 'system', content: `Context: ${context}` },
                { role: 'user', content: `${question}` }
            ],
            max_tokens: 150,
            temperature: 0.7,
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        };

        const response = await makeApiRequest('https://api.openai.com/v1/chat/completions', data, headers);

        res.json({
            answer: response.choices[0].message.content.trim()
        });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', {
            message: error.message,
            stack: error.stack,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : 'No response'
        });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
