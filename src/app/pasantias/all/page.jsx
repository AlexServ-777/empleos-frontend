export const dynamic = 'force-dynamic';
import MostrarPasantias from "@/components/pasantias/all";

export default async function Page(){
    const response = await fetch("https://localhost:3000/back/api/pasantias-c/getPublic/Bolivia");
    const pasantias= await response.json();
    return <MostrarPasantias pasantias={pasantias}/>
}