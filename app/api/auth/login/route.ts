// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { authorize } from '@/app/services/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = await authorize({ username: email, password });
    
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true,
      user 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Authentication failed' 
    }, { status: 401 });
  }
}