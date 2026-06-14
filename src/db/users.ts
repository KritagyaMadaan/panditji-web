import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface UserInput {
  uid: string;
  email: string | null;
  name: string;
  phone: string;
}

export async function getOrCreateUser(input: UserInput) {
  try {
    const result = await db.insert(users)
      .values({
        uid: input.uid,
        email: input.email,
        name: input.name,
        phone: input.phone,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: input.email,
          name: input.name,
          phone: input.phone,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    // Fallback search in case upsert failed for some reason
    const existing = await db.select().from(users).where(eq(users.uid, input.uid));
    if (existing.length > 0) return existing[0];
    throw error;
  }
}

export async function getUserByUid(uid: string) {
  const result = await db.select().from(users).where(eq(users.uid, uid));
  return result[0];
}
