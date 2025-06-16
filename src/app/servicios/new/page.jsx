import NewService from "@/components/servicios/new";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Publicar Servicio | JobGet-Lat',
    description: 'Ofrece tus servicios profesionales y conecta con clientes potenciales en JobGet-Lat',
};

export default async function Page() {
    const headersList = await headers();
    const cookie = await cookies()
    const response = await fetch(process.env.url_front+"/back/api/auth/verificar-token",{
        headers:{
            Cookie: cookie
        }
    });
    const userAgent = headersList.get('user-agent') || '';
    const isBot = /bot|googlebot|crawler|spider|crawling/i.test(userAgent);
    if(response.ok||isBot){
        return <NewService/>;
    }
    else{
        return redirect("/user/login");
    }
}