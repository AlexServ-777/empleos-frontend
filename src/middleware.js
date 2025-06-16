import { NextResponse } from 'next/server';
import countries from 'i18n-iso-countries';

export function middleware(request) {
  countries.registerLocale(require("i18n-iso-countries/langs/es.json"));
  const country = request.geo?.country || 'BO';

  const pais = countries.getName(country,'es')
  const response = NextResponse.next(); // crea el response

  // Setea la cookie
  response.cookies.set('country', pais, {
    path: '/',
    maxAge: 60 * 60 * 24, // 1 día
    sameSite: 'none',
    secure: true,
  });
  return response; // ✅ devuelve el response modificado
}

export const config = {
  matcher: '/:path*',
};
