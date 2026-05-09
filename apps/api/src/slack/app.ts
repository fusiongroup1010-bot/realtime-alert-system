// apps/api/src/slack/app.ts
import pkg from '@slack/bolt';
const { App } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false, // Set to true if using Socket Mode for local testing without webhooks
});

// Setup handlers
slackApp.action('ack_alert', async ({ action, ack, body, client }) => {
  await ack();
  console.log('Ack button clicked', body);
  // Implementation for updating DB and alert card goes here
});
