import MostrarEmpleos from "@/components/empleos/all";

export const dynamic = 'force-dynamic';

export default async function Page(){
    const response = await fetch("https://localhost:8000/api/empleos-c/getPublic/Bolivia");
    const empleos= await response.json();
    return <MostrarEmpleos empleos={empleos}/>
}