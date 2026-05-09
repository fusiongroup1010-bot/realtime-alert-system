// apps/worker/src/index.ts
import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { AnomalyDetector, defaultRules } from '@realtime-alert/shared';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();

// Define queues
const anomalyQueue = new Queue('anomaly-scan', { connection });
const escalationQueue = new Queue('escalation-check', { connection });

// 1. Worker for Anomaly Scanning (Runs every 60s)
const scanWorker = new Worker('anomaly-scan', async (job) => {
  console.log('Running anomaly scan...');
  
  const rules = await prisma.rule.findMany({ where: { isActive: true } });
  
  for (const rule of rules) {
    // Mocking metric data fetching
    const mockValue = Math.random() * 10; 
    const isAnomaly = AnomalyDetector.checkThreshold(mockValue, rule.thresholdExpr);
    
    if (isAnomaly) {
      console.log(`Anomaly detected for rule ${rule.code}: value ${mockValue}`);
      // Logic to create Alert and trigger Slack notification goes here
    }
  }
}, { connection });

// 2. Worker for Escalation (Check unresolved alerts)
const escalationWorker = new Worker('escalation-check', async (job) => {
  const { alertId } = job.data;
  console.log(`Checking escalation for alert ${alertId}`);
  // Implementation for escalation logic goes here
}, { connection });

// Schedule the cron job
async function setupCron() {
  await anomalyQueue.add('daily-scan', {}, {
    repeat: {
      pattern: '* * * * *', // Every minute
    }
  });
  console.log('Anomaly scan cron scheduled.');
}

setupCron();
