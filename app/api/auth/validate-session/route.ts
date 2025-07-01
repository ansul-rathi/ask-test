import { NextResponse } from 'next/server';
import { getServerSession } from '@/app/utils/serverAuth';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.isAuthenticated) {
      return NextResponse.json({ 
        isAuthenticated: false 
      });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: session.user
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ 
      isAuthenticated: false 
    }, { 
      status: 401 
    });
  }
}