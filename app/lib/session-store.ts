// @/app/lib/session-store.ts
import { redisClient, connectRedis } from './redis'; // Add import
import type { Session } from 'next-auth';

const PREFIX = 'session:';

export const sessionStore = {
  async get(sessionToken: string): Promise<Session | null> {
    await connectRedis();
    const data = await redisClient.get(`${PREFIX}${sessionToken}`);
    return data ? JSON.parse(data) : null;
  },
  async set(sessionToken: string, session: Session): Promise<void> {
    await connectRedis();
    await redisClient.setEx(
      `${PREFIX}${sessionToken}`,
      60 * 60 * 24 * 30, // 30 days
      JSON.stringify(session)
    );
  },
  async delete(sessionToken: string): Promise<void> {
    await connectRedis();
    await redisClient.del(`${PREFIX}${sessionToken}`);
  },
};

export type SessionWithTokens = Session & {
  accessToken?: string;
  idToken?: string;
  expires?: string;
  error?: string;
};