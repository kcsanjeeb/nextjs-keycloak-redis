// @/app/lib/auth-options.ts

import type { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { SessionWithTokens, sessionStore } from './session-store'; // Add import
import https from 'https';

const keycloakIssuer = process.env.NODE_ENV === 'development' 
  ? 'https://auth.localhost/auth/realms/myrealm'
  : process.env.KEYCLOAK_ISSUER;


export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: keycloakIssuer,
      httpOptions: {
        agent: new https.Agent({
          rejectUnauthorized: false // ONLY FOR DEVELOPMENT
        })
      },
      authorization: {
        params: {
          prompt: "login", // Always show login screen
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use database (Redis) backed sessions now
    maxAge: 30 * 24 * 60 * 60,
  },
    callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      }
      return token;
    },
    async session({ session, token }): Promise<SessionWithTokens> {
      const sessionData: SessionWithTokens = {
        ...session,
        accessToken: token.accessToken as string,
        idToken: token.idToken as string,
        expires: token.expiresAt
          ? new Date((token.expiresAt as number) * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        error: undefined,
      };

      if (typeof window !== 'undefined' && window.location.pathname === '/login') {
        return sessionData;
      }

      try {
        const response = await fetch(
          `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          sessionData.error = 'Session invalid';
        }
      } catch (error) {
        sessionData.error = error instanceof Error ? error.message : 'Session validation failed';
      }

      // Save session data in Redis with session token as key
      // if (session?.user?.email) {
      //   // Use email as a unique session key or get sessionToken from somewhere appropriate
      //   // Here we assume token.sub as a session token identifier
      //   const sessionToken = token.sub || session.user.email;
      //   await sessionStore.set(sessionToken, sessionData);
      // }

      const sessionToken = token.sub; // Always use sub
if (!sessionToken) throw new Error('No sub claim in token');
await sessionStore.set(sessionToken, sessionData);

      return sessionData;
    },
      },
  events: {
    async signOut({ token }) {
      if (token.idToken) {
           await fetch(
          `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?id_token_hint=${token.idToken}`,
          { redirect: "manual" });
      }
          if (token.sub) {
        // Delete session from Redis on sign out
        await sessionStore.delete(token.sub);
      }
    },
    },
};

