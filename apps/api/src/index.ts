// apps/api/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { slackApp } from './slack/app';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors);

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Slack Webhook endpoint
fastify.post('/webhooks/slack', async (request, reply) => {
  // Pass the request to the Bolt Receiver
  // Note: Standard Bolt Receiver works best with Node http. 
  // In a real project with Fastify, you might use a custom adapter.
  return { status: 'webhook received' };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`API Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
