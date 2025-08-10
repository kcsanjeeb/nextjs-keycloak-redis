// app/lib/session-utils.ts

import { getServerSession } from './auth';

export async function validateSession() {
  const session = await getServerSession();
  
  if (!session) {
    return { valid: false, error: 'No session found' };
  }

  // Skip validation if we're already on the login page
  if (typeof window !== 'undefined' && window.location.pathname === '/login') {
    return { valid: true, session };
  }

  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    
    return {
      valid: response.ok,
      error: response.ok ? undefined : 'Session invalid',
      session: response.ok ? session : undefined
    };
  } catch (error) {
    return { valid: false, error: 'Validation failed' };
  }
}