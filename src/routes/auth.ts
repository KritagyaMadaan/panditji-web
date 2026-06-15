import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, users, panditProfiles } from '../db/index.ts';
import { eq } from 'drizzle-orm';

export default async function authRoutes(fastify: FastifyInstance) {
  // POST /api/v1/auth/sync
  fastify.post('/v1/auth/sync', { preHandler: [fastify.verifyJWT] }, async (request: any) => {
    const { name, phone, role, city, spec } = request.body || {};
    
    // Always update if explicit values were provided (signup form data is authoritative)
    const userUpdates: any = {};
    if (name) userUpdates.name = name;
    if (phone) userUpdates.phone = phone;
    if (role) userUpdates.role = role;

    if (Object.keys(userUpdates).length > 0) {
      const result = await db.update(users)
        .set(userUpdates)
        .where(eq(users.id, request.user.id))
        .returning();
      if (result[0]) request.user = result[0];
    }

    // Handle Pandit-specific onboarding data
    if (role === 'pandit' || request.user.role === 'pandit') {
      const existingProfile = (await db.select().from(panditProfiles).where(eq(panditProfiles.userId, request.user.id)))[0];
      
      if (!existingProfile) {
        await db.insert(panditProfiles).values({
          userId: request.user.id,
          specializations: spec ? [spec] : [],
          bio: city ? `Based in ${city}` : '',
        });
      } else if (spec) {
        // Add specialization if not already present
        const currentSpecs = (existingProfile.specializations as string[]) || [];
        if (!currentSpecs.includes(spec)) {
          await db.update(panditProfiles)
            .set({ specializations: [...currentSpecs, spec] })
            .where(eq(panditProfiles.userId, request.user.id));
        }
      }
    }
    
    return { success: true, data: request.user };
  });

  // GET /api/v1/auth/me
  fastify.get('/v1/auth/me', { preHandler: [fastify.verifyJWT] }, async (request: any) => {
    try {
      const user = (await db.select().from(users).where(eq(users.id, request.user.id)))[0];
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user' };
    }
  });
}
