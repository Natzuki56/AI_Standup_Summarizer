
import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());

app.post('/notify', async (req, res) => {
  // In a real system, we'd gather today's summaries and send email/Slack.
  // Here we return a stubbed response for demo purposes.
  const { userId } = req.body || {};
  return res.json({ ok: true, message: `Would send daily digest${userId ? ' for '+userId : ''}.` });
});

export const http = serverless(app);
