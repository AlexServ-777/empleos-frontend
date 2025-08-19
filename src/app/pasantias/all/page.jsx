
import MostrarPasantias from "@/components/pasantias/all";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Pasantías | JobGet-Lat',
    description: 'Encuentra pasantias rapidamente, aqui en JobGet-Lat',
};

export default async function Page(){
    
    const cookie = await cookies();
    const pais = cookie.get('country').value;
    const response = await fetch(process.env.url_front+`/back/api/pasantias-c/getPublic/${pais}?page=1`, {
        //next:{revalidate:600} //10 minutos
    });
    const pasantias= await response.json();
    return <MostrarPasantias pasantias={pasantias}/>
}