'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Página no encontrada</h2>
      <p className="lead mb-4">Lo sentimos, la página que estás buscando no existe.</p>
      <Link href="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
} 