export const dynamic = 'force-dynamic';
import MostrarPasantias from "@/components/pasantias/all";

export default async function Page(){
    const response = await fetch(process.env.url_front+"/back/api/pasantias-c/getPublic/Bolivia");
    const pasantias= await response.json();
    return <MostrarPasantias pasantias={pasantias}/>
}