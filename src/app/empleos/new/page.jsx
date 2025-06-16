export const dynamic = 'force-dynamic';
import NuevoEmpleo from "@/components/empleos/new";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
    title: 'Publicar Empleo | JobGet-Lat',
    description: 'Publica tu oferta de empleo y encuentra el mejor talento para tu empresa o negocio en JobGet-Lat',
};

export default async function Page() {
    const headersList=await headers();
    const cookie = await cookies()
    const response = await fetch(process.env.url_front+"/back/api/auth/verificar-token",{
        headers:{
            Cookie: cookie
        }
    });
    const userAgent = headersList.get('user-agent') || '';
    const isBot = /bot|googlebot|crawler|spider|crawling/i.test(userAgent);
    if(response.ok||isBot){
        return <NuevoEmpleo/>;
    }
    else{
        return redirect("/user/login");
    }
}