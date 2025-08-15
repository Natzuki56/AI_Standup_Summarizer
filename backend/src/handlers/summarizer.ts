
import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateRealisticData } from '../lib/data-generator.js';

const app = express();
app.use(express.json());

async function summarizeWithGemini(text: string, apiKey: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Please provide a concise summary of this standup update. Focus on the key points from yesterday, today's plans, and any blockers. Keep it brief but informative:

${text}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary with Gemini API');
  }
}

// HTTP endpoint
app.post('/summarize', async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY environment variable is required' 
    });
  }

  try {
    const summary = await summarizeWithGemini(text, apiKey);
    return res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Lightweight ping endpoint for performance testing (no AI processing)
app.post('/ping', async (req, res) => {
  const { message } = req.body || {};
  
  try {
    // Just echo back the message with timestamp - no processing overhead
    return res.json({ 
      message: message || 'pong',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ping error:', error);
    return res.status(500).json({ 
      error: 'Ping failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Heavy payload endpoint for performance testing
app.post('/heavy-payload', async (req, res) => {
  const { message, size_kb = 1024 } = req.body || {}; // Default to 1MB
  
  try {
    const data = generateRealisticData(size_kb);
    
    // Add response size info
    (data as any).response_metadata = {
      protocol: 'HTTP',
      response_size_bytes: JSON.stringify(data).length
    };
    
    return res.json(data);
  } catch (error) {
    console.error('Heavy payload error:', error);
    return res.status(500).json({ 
      error: 'Heavy payload generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export const http = serverless(app);
