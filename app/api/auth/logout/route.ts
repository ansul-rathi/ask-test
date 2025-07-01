// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log("🔴 SERVER LOGOUT: Clearing auth_token cookie...");
    
    const response = NextResponse.json({ success: true });
    
    // Clear the auth_token cookie specifically
    response.cookies.set('auth_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,  // Match how it was originally set
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log("🔴 SERVER LOGOUT: auth_token cookie cleared");
    return response;
    
  } catch (error) {
    console.error('🔴 SERVER LOGOUT ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}