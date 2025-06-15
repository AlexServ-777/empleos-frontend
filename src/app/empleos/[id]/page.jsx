import OneEmpleo from "@/components/empleos/one";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
    const { id } = await params;
    const cookie = await cookies();
    const resToken = await fetch(process.env.url_front+"/back/api/auth/csrf-token",{
        headers:{
            Cookie: cookie
        }
    });
    const {token:csrfToken} = await resToken.json();

    const response = await fetch(process.env.url_front+"/back/api/empleos-c/infoEmpleo/"+id);
    const data = await response.json();

    const initFavorito = async(empleo)=>{ //verificar si este empleo es favorito. return: true o false
        const response = await fetch(process.env.url_front+"/back/api/usuarios-c/isFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:empleo.id_empleo,
                tipo_recurso:"empleo"
            }),
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token": csrfToken,
                "Cookie":cookie
            }
        });
        const dataFav = await response.json(data);
        return dataFav;
    }
    const isFavorito=await initFavorito(data);
    return <OneEmpleo empleo={data} favorito={isFavorito}/>
}