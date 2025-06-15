import OnePasantias from "@/components/pasantias/one";
import { cookies } from "next/headers";

export default async function Page({params}) {
    const {id} = await params;
    const cookie = await cookies();
    const resToken = await fetch(process.env.url_front+"/back/api/auth/csrf-token",{
        headers:{
            Cookie: cookie
        }
    });
    const {token:csrfToken} = resToken.json();

    const response = await fetch(process.env.url_front+"/back/api/pasantias-c/"+id);
    const data = await response.json();

    
    const initFavorito = async(pasantia)=>{ //verificar si este empleo es favorito. return: true o false
        const response = await fetch(process.env.url_front+"/back/api/usuarios-c/isFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:pasantia.id_pasantia,
                tipo_recurso:"pasantia"
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
    const isFavorito = await initFavorito(data);
    return <OnePasantias pasantia={data} favorito={isFavorito}/>

}