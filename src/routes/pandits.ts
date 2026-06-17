import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, users, panditProfiles, services } from '../db/index.ts';
import { eq, and, sql, desc, asc } from 'drizzle-orm';

const searchSchema = z.object({
  lat: z.string().transform(Number),
  lng: z.string().transform(Number),
  radius_km: z.string().default('10').transform(Number),
  service_id: z.string().optional().transform(v => v ? Number(v) : undefined),
  language: z.string().optional(),
  min_rating: z.string().optional().transform(v => v ? Number(v) : undefined),
  sort: z.enum(['distance', 'rating', 'price']).default('distance'),
  page: z.string().default('1').transform(Number),
});

export default async function panditRoutes(fastify: FastifyInstance) {
  // GET /api/v1/pandits/search
  fastify.get('/v1/pandits/search', async (request, reply) => {
    const parseResult = searchSchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send({ success: false, error: parseResult.error.format() });
    }

    const { lat, lng, radius_km, service_id, language, min_rating, sort, page } = parseResult.data;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      // Using PostGIS ST_DWithin
      const distanceSql = sql`ST_Distance(${users.location}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography)`;
      
      const conditions = [
        eq(users.role, 'pandit'),
        sql`ST_DWithin(${users.location}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${radius_km * 1000})`
      ];

      if (min_rating) {
        conditions.push(sql`${panditProfiles.ratingAvg} >= ${min_rating}`);
      }

      let baseQuery = db
        .select({
          id: users.id,
          name: users.name,
          photoUrl: users.photoUrl,
          bio: panditProfiles.bio,
          experience: panditProfiles.experience,
          languages: panditProfiles.languages,
          rating: panditProfiles.ratingAvg,
          distance: distanceSql,
        })
        .from(users)
        .innerJoin(panditProfiles, eq(users.id, panditProfiles.userId))
        .where(and(...conditions));

      // Sorting and Pagination
      if (sort === 'distance') {
        baseQuery = baseQuery.orderBy(asc(distanceSql)) as any;
      } else if (sort === 'rating') {
        baseQuery = baseQuery.orderBy(desc(panditProfiles.ratingAvg)) as any;
      }

      const results = await baseQuery.limit(limit).offset(offset);

      return { success: true, data: results };
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ success: false, error: 'Search failed' });
    }
  });

  // GET /api/v1/pandits/:id/profile
  fastify.get('/v1/pandits/:id/profile', async (request: any, reply) => {
    const id = Number(request.params.id);
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          panditProfile: {
            with: {
              weddingPackages: true,
            }
          },
          bookingsAsPandit: {
            limit: 5,
            orderBy: [desc(sql`created_at`) as any],
          }
        }
      });

      if (!result || result.role !== 'pandit') {
        return reply.status(404).send({ success: false, error: 'Pandit not found' });
      }

      return { success: true, data: result };
    } catch (error) {
       console.error(error);
       return reply.status(500).send({ success: false, error: 'Failed to fetch profile' });
    }
  });

  // GET /api/v1/pandits/:id/availability
  fastify.get('/v1/pandits/:id/availability', async (request: any) => {
    const id = Number(request.params.id);
    // Simple availability fetch
    const slots = await db.select().from(sql`pandit_availability` as any).where(eq(sql`pandit_id` as any, id));
    return { success: true, data: slots };
  });

  // Legacy/Shortcut for UI
  fastify.get('/pandits', async () => {
    const results = await db
      .select({
        id: users.id,
        name: users.name,
        photoUrl: users.photoUrl,
        bio: panditProfiles.bio,
        experience: panditProfiles.experience,
        rating: panditProfiles.ratingAvg,
        specializations: panditProfiles.specializations,
        languages: panditProfiles.languages,
        pricingTier: panditProfiles.pricingTier,
      })
      .from(users)
      .innerJoin(panditProfiles, eq(users.id, panditProfiles.userId))
      .where(eq(users.role, 'pandit'))
      .limit(50); // increased limit to show all registered pandits
  });
}
