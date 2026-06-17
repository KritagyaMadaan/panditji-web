import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, users, panditProfiles } from '../db/index.ts';
import { eq } from 'drizzle-orm';

export default async function authRoutes(fastify: FastifyInstance) {
  // POST /api/v1/auth/sync
  fastify.post('/v1/auth/sync', { preHandler: [fastify.verifyJWT] }, async (request: any) => {
    const { 
      name, 
      phone, 
      role, 
      city, 
      experience, 
      bio, 
      expertise, 
      languages: langs, 
      aadhaarNumber,
      photoUrl
    } = request.body || {};
    
    // Always update if explicit values were provided (signup form data is authoritative)
    const userUpdates: any = {};
    if (name) userUpdates.name = name;
    if (phone) userUpdates.phone = phone;
    if (role) userUpdates.role = role;
    if (photoUrl !== undefined) userUpdates.photoUrl = photoUrl;

    if (Object.keys(userUpdates).length > 0) {
      const result = await db.update(users)
        .set(userUpdates)
        .where(eq(users.id, request.user.id))
        .returning();
      if (result[0]) request.user = result[0];
    }

    // Handle Pandit-specific onboarding/profile data
    if (role === 'pandit' || request.user.role === 'pandit') {
      const existingProfile = (await db.select().from(panditProfiles).where(eq(panditProfiles.userId, request.user.id)))[0];
      
      const profileData: any = {};
      if (bio !== undefined) profileData.bio = bio || (city ? `Based in ${city}` : '');
      if (experience !== undefined) profileData.experience = Number(experience) || 0;
      if (langs !== undefined) profileData.languages = Array.isArray(langs) ? langs : [];
      if (expertise !== undefined) profileData.specializations = Array.isArray(expertise) ? expertise : [];
      if (aadhaarNumber) profileData.aadharStatus = 'verified';

      if (!existingProfile) {
        await db.insert(panditProfiles).values({
          userId: request.user.id,
          specializations: Array.isArray(expertise) ? expertise : [],
          languages: Array.isArray(langs) ? langs : [],
          bio: bio || (city ? `Based in ${city}` : ''),
          experience: Number(experience) || 0,
          aadharStatus: aadhaarNumber ? 'verified' : 'pending',
        });
      } else {
        await db.update(panditProfiles)
          .set(profileData)
          .where(eq(panditProfiles.userId, request.user.id));
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
