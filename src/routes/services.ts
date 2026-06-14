import { FastifyInstance } from 'fastify';
import { db, services } from '../db/index.ts';
import { eq } from 'drizzle-orm';

export default async function serviceRoutes(fastify: FastifyInstance) {
  fastify.get('/v1/services', async () => {
    return { success: true, data: await db.select().from(services).where(eq(services.isActive, true)) };
  });

  fastify.get('/v1/services/:id', async (request: any, reply) => {
    const id = Number(request.params.id);
    const service = (await db.select().from(services).where(eq(services.id, id)))[0];
    if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });
    return { success: true, data: service };
  });

  // Shortcut for UI
  fastify.get('/services', async () => {
    return await db.select().from(services).where(eq(services.isActive, true));
  });
}
