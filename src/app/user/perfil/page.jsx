import Perfil from "@/components/user/perfil/main";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Page() {
        const cookie = await cookies();
        const response = await fetch(process.env.url_front+"/back/api/usuarios-c/user", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Cookie": cookie
            },
        });
        const userInf = await response.json();
        if(!response.ok){
            return redirect("/user/login");
        }
        return <Perfil userInf={userInf}/>

    
}