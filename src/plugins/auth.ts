import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import Redis from 'ioredis';
import axios from 'axios';
import { db, users } from '../db/index.ts';
import { eq } from 'drizzle-orm';

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'first-case-771nt',
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    verifyJWT: any;
    otp: {
      generate: (phone: string) => Promise<string>;
      verify: (phone: string, code: string) => Promise<boolean>;
      send: (phone: string, code: string) => Promise<void>;
    };
  }
}

// In-memory fallback for OTP if Redis is not configured
const otpMemoryStore = new Map<string, { code: string; expires: number }>();

const authPlugin: FastifyPluginCallback = (fastify, options, done) => {
  fastify.decorate('verifyJWT', async (request: any, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      
      // Fetch or sync user from DB
      let user = (await db.select().from(users).where(eq(users.uid, decodedToken.uid)))[0];
      
      if (!user && decodedToken.phone_number) {
        // Auto-create user if they exist in Firebase but not in our DB
        const result = await db.insert(users).values({
          uid: decodedToken.uid,
          phone: decodedToken.phone_number,
          name: decodedToken.name || 'Valued User',
          email: decodedToken.email || null,
        }).returning();
        user = result[0];
      }

      if (!user) {
        return reply.status(401).send({ error: 'User not synchronized' });
      }

      request.user = user;
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized: Invalid token', details: err });
    }
  });

  // Redis setup
  const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

  fastify.decorate('otp', {
    generate: async (phone: string) => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
      
      if (redis) {
        await redis.set(`otp:${phone}`, code, 'EX', expiryMinutes * 60);
      } else {
        otpMemoryStore.set(phone, { 
          code, 
          expires: Date.now() + expiryMinutes * 60 * 1000 
        });
      }
      return code;
    },
    verify: async (phone: string, code: string) => {
      if (redis) {
        const storedCode = await redis.get(`otp:${phone}`);
        if (storedCode === code) {
          await redis.del(`otp:${phone}`);
          return true;
        }
      } else {
        const entry = otpMemoryStore.get(phone);
        if (entry && entry.code === code && entry.expires > Date.now()) {
          otpMemoryStore.delete(phone);
          return true;
        }
      }
      return false;
    },
    send: async (phone: string, code: string) => {
      const authKey = process.env.MSG91_AUTH_KEY;
      if (!authKey) {
        console.log(`[OTP MOCK] Sending OTP ${code} to ${phone}`);
        return;
      }

      try {
        await axios.post('https://api.msg91.com/api/v5/otp', {
          template_id: process.env.MSG91_TEMPLATE_ID,
          mobile: phone,
          authkey: authKey,
          otp: code,
        });
      } catch (error) {
        console.error('Error sending OTP via MSG91:', error);
        throw new Error('Failed to send OTP');
      }
    }
  });

  done();
};

export default fp(authPlugin);
