import Home from "@/components";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
export default async function Page() {
    try {
        const cookie = await cookies();
        const pais = cookie.get('country').value;
        const responseEmp = await fetch(process.env.url_front + "/back/api/empleos-c/getPublic/" + pais);
        const dataEmp = await responseEmp.json();

        //pasantias
        const responsePas = await fetch(process.env.url_front + "/back/api/pasantias-c/getPublic/" + pais);
        const dataPas = await responsePas.json();

        //servicios
        const responseSer = await fetch(process.env.url_front + "/back/api/servicios-c/getPublic/" + pais);
        const dataSer = await responseSer.json();

        return <Home empleos={dataEmp} pasantias={dataPas} servicios={dataSer} />
    }
    catch (error) {
        console.log("error xd:" + error)
    }
}