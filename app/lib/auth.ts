// @/app/lib/auth.ts

import { authOptions } from './auth-options';
import NextAuth from 'next-auth';
import { getServerSession as getServerSessionInner } from 'next-auth';

// Create the auth handlers
const handlers = NextAuth(authOptions);

// Re-export the auth functions with proper types
export const auth = async () => {
  return await getServerSessionInner(authOptions);
};

export const signIn = async (provider?: string, options?: any) => {
  // In App Router, we should redirect to the sign-in page
  const callbackUrl = options?.callbackUrl || '/dashboard';
  const signInUrl = `/api/auth/signin/${provider || 'keycloak'}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  return signInUrl;
};

export const signOut = async (options?: any) => {
  // In App Router, we should redirect to the sign-out endpoint
  const callbackUrl = options?.redirectTo || '/login';
  const signOutUrl = `/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  return signOutUrl;
};

export const getServerSession = async () => {
  return await getServerSessionInner(authOptions);
};

// Type exports
export type { Session } from 'next-auth';
export type { SessionWithTokens } from './session-store';