import "@/styles/navBar.css";
// Estilos de terceros primero
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-phone-number-input/style.css";

//estilos globales
import '@/styles/globals.css';
import "@/styles/all-items.css";
import '@/styles/buscador.css';
import "@/styles/loader.css";
import "@/styles/widthsPersonalizados.css";
import "@/styles/phone-input.css";
import "@/styles/alertMessage.css";


//estilos obligados a ser movidos aqui
import '@/styles/forgotPassword-send-email.css';
import '@/styles/terminosCondiciones.css';
import "@/styles/oneStyles.css";
import "@/styles/perfilStyles.css";
import "@/styles/loginStyle.css";
import "@/styles/news-form-components.css";
import "@/styles/warning.css";
import '@/styles/filters.css';
import "@/styles/footer.css";
import "@/styles/navBar.css"
import "@/styles/bienvenida.css";
import "@/styles/barPerfil.css";
import "@/styles/googleButton.css";

import { Providers } from "./providers";

export const metadata = {
  title: "ENCUENTRA TODO TIPO DE EMPLEOS, PASANTIAS Y SERVICIOS EN UN SOLO LUGAR",
  description: "En JOBGET-LAT puedes encontrar variedades de oportunidades de forma rapida y sencilla",
  icon:"/favicon.ico"
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
