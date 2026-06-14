import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, users } from '../db/index.ts';
import { eq } from 'drizzle-orm';

const phoneSchema = z.object({
  phone: z.string().regex(/^\+?91[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+?91[6-9]\d{9}$/, 'Invalid Indian phone number'),
  code: z.string().length(6),
  name: z.string().optional(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  // POST /api/v1/auth/send-otp
  fastify.post('/v1/auth/send-otp', async (request, reply) => {
    const parseResult = phoneSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ success: false, error: parseResult.error.format() });
    }

    const { phone } = parseResult.data;

    // Rate limiting logic would go here (e.g. via Redis)
    
    try {
      const code = await fastify.otp.generate(phone);
      await fastify.otp.send(phone, code);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Failed to send OTP' });
    }
  });

  // POST /api/v1/auth/verify-otp
  fastify.post('/v1/auth/verify-otp', async (request, reply) => {
    const parseResult = verifyOtpSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ success: false, error: parseResult.error.format() });
    }

    const { phone, code, name } = parseResult.data;

    const isValid = await fastify.otp.verify(phone, code);
    if (!isValid) {
      return reply.status(401).send({ success: false, error: 'Invalid or expired OTP' });
    }

    // Upsert user in DB
    try {
      let user = (await db.select().from(users).where(eq(users.phone, phone)))[0];
      
      if (!user) {
        const result = await db.insert(users).values({
          phone,
          name: name || 'Valued Customer',
          uid: `phone-${phone}-${Date.now()}`, // Fallback UID if not using Firebase Auth on server
        }).returning();
        user = result[0];
      }

      // Since we switched to Firebase Auth verified with firebase-admin, 
      // we don't issue our own JWTs here unless specifically requested.
      // For now, we'll return the user object.
      return { success: true, data: { user } };
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ success: false, error: 'Internal server error during auth' });
    }
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
