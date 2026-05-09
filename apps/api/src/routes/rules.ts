// apps/api/src/routes/rules.ts
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function ruleRoutes(fastify: FastifyInstance) {
  // GET /api/rules
  fastify.get('/api/rules', async () => {
    return await prisma.rule.findMany({
      orderBy: { createdAt: 'desc' },
    });
  });

  // POST /api/rules
  fastify.post('/api/rules', async (request) => {
    const data = request.body as any;
    return await prisma.rule.create({
      data,
    });
  });
}
