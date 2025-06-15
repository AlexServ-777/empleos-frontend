import NewPasantia from "@/components/pasantias/new";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Page() {
    try {
        const cookie = await cookies();
        const response = await fetch(process.env.url_front+"/back/api/auth/verificar-token",{
            headers:{
                Cookie: cookie
            },
            cache: 'no-store'
        });
        
        if(response.ok){
            return <NewPasantia/>;
        }
        else{
            return redirect("/user/login");
        }
    } catch (error) {
        console.error('Error al verificar token:', error);
        return redirect("/user/login");
    }
}