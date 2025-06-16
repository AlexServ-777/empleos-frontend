export const dynamic = 'force-dynamic';
import MostrarPasantias from "@/components/pasantias/all";
import { cookies } from "next/headers";

export const metadata = {
    title: 'Pasantías | JobGet-Lat',
    description: 'Encuentra pasantias rapidamente, aqui en JobGet-Lat',
};

export default async function Page(){
    
    const cookie = await cookies();
    const pais = cookie.get('country').value;
    const response = await fetch(process.env.url_front+"/back/api/pasantias-c/getPublic/"+pais);
    const pasantias= await response.json();
    return <MostrarPasantias pasantias={pasantias}/>
}