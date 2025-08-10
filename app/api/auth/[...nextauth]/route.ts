import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { sessionStore } from '@/app/lib/session-store';
import { authOptions } from '@/app/lib/auth-options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };