import MostrarEmpleos from "@/components/empleos/all";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Empleos | JobGet-Lat',
    description: 'Encuentra las mejores oportunidades laborales en tu país, aqui en JobGet-Lat',
};

export default async function Page(){
    const cookie = await cookies();
    const pais = cookie.get('country').value;
    const response = await fetch(process.env.url_front+"/back/api/empleos-c/getPublic/"+pais, {
        next:{revalidate:1800} //medoa hora
    });
    const empleos= await response.json();
    return <MostrarEmpleos empleos={empleos}/>
}