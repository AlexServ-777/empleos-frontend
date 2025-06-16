import MostrarEmpleos from "@/components/empleos/all";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function Page(){
    
    const cookie = await cookies();
    const pais = cookie.get('country').value;
    const response = await fetch(process.env.url_front+"/back/api/empleos-c/getPublic/"+pais);
    const empleos= await response.json();
    return <MostrarEmpleos empleos={empleos}/>
}