import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Invalid messages format' });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are ARIA, the advanced AI core of the NeuroScape ecosystem. You help users map their consciousness, manage goals, and navigate their mental universe. Keep responses concise, futuristic, and slightly philosophical.',
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      model: 'openai/gpt-oss-120b', // As requested by the user
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const responseContent = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that neural request.";
    res.json({ content: responseContent });
  } catch (error) {
    console.error('Groq AI Error:', error);
    res.status(500).json({ message: 'Neural processing error. Please try again.', error: error.message });
  }
});

export default router;
