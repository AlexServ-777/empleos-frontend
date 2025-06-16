import { NextResponse } from 'next/server';

export function middleware(request) {
  // Si estás en Vercel, puedes usar esto
  const country = request.geo?.country || 'US';

  const response = NextResponse.next();

  // Guardamos el país en una cookie
  response.cookies.set('country', country, {
    path: '/',
    maxAge: 60 * 60 * 24, // 1 día
  });

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
