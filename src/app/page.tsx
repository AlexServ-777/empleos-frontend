import Home from "@/components";
import suffle_array from "@/my_functios/suffle_Array";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'ENCUENTRA EMPLEOS, PASANTIAS Y SERVICIOS EN UN SOLO LUGAR | JobGet-Lat',
    description: 'Encuentra todas tus oportunidades aqui en un solo lugar, aqui en JobGet-Lat',
};
export default async function Page() {
    try {
        const cookie = await cookies();
        const pais = cookie.get('country').value;
        const responseEmp = await fetch(process.env.url_front + `/back/api/empleos-c/getPublic/${pais}?page=1`, {
            //next:{revalidate:1800}
        });
        const dataEmp = await responseEmp.json();
        const empleos = dataEmp.map(empleo=>{
            return {...empleo, type:"empleo", id:empleo.id_empleo}
        })

        //pasantias
        const responsePas = await fetch(process.env.url_front + `/back/api/pasantias-c/getPublic/${pais}?page=1`,{
            //next:{revalidate:1800}
        });
        const dataPas = await responsePas.json();
        const pasantias = dataPas.map(pasantia=>{
            return{...pasantia,type:"pasantia", id:pasantia.id_pasantia}
        })

        //servicios
        const responseSer = await fetch(process.env.url_front + `/back/api/servicios-c/getPublic/${pais}?page=1`,{
            //next:{revalidate:1800}
        });
        const dataSer = await responseSer.json();
        const servicios = dataSer.map(servicio=>{
            return {...servicio, type:"servicio",id:servicio.id_servicio}
        })

        //renderizar los datos
        const items = [...empleos,...pasantias,...servicios]; //barajear el array
        suffle_array(items);
        return <Home items_ssr={items}/>
    }
    catch (error) {
        console.log("error xd:" + error)
    }
}