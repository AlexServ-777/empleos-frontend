
import "@/styles/imports.css";
// Estilos de terceros primero
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-phone-number-input/style.css";

import { Providers } from "./providers";

export const metadata = {
  title: "ENCUENTRA TODO TIPO DE EMPLEOS, PASANTIAS Y SERVICIOS EN UN SOLO LUGAR",
  description: "En JOBGET-LAT puedes encontrar variedades de oportunidades de forma rapida y sencilla",
  icon:"/favicon.ico",
  other:{
    "google-adsense-account":"ca-pub-7383764596596086"
  }
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
