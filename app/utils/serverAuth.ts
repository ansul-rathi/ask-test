import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  'custom:stripeCustomerId'?: string;
  exp: number;
}

export async function getServerSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return null;
    }

    return {
      user: {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        stripeCustomerId: decoded['custom:stripeCustomerId']
      },
      isAuthenticated: true
    };
  } catch (error) {
    return null;
  }
}