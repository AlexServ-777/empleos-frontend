import Home from "@/components";
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
        const responseEmp = await fetch(process.env.url_front + "/back/api/empleos-c/getPublic/" + pais, {
            next:{revalidate:1800}
        });
        const dataEmp = await responseEmp.json();

        //pasantias
        const responsePas = await fetch(process.env.url_front + "/back/api/pasantias-c/getPublic/" + pais,{
            next:{revalidate:1800}
        });
        const dataPas = await responsePas.json();

        //servicios
        const responseSer = await fetch(process.env.url_front + "/back/api/servicios-c/getPublic/" + pais,{
            next:{revalidate:1800}
        });
        const dataSer = await responseSer.json();

        return <Home empleos={dataEmp} pasantias={dataPas} servicios={dataSer} />
    }
    catch (error) {
        console.log("error xd:" + error)
    }
}