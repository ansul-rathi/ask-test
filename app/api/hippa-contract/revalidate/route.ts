import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  // Revalidate the cache for this email
  revalidateTag(`hippa-contract-${email}`);

  return NextResponse.json({ revalidated: true, now: Date.now() });
} 