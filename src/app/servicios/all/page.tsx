import MostrarServicios from "@/components/servicios/all";
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Servicios | JobGet-Lat',
    description: 'Descubre los mejores servicios profesionales disponibles en tu país, aqui en JobGet-Lat',
};

export default async function Page() {
    try {
        const cookie = await cookies();
        const pais = cookie.get('country').value;
        const response = await fetch(process.env.url_front + `/back/api/servicios-c/getPublic/${pais}?page=1`, {
            //next:{revalidate:600} //10 minutos
        });
        const servicios = await response.json();
        return <MostrarServicios servicios={servicios} />
    }
    catch {

        return <MostrarServicios servicios={[]} />
    }
}