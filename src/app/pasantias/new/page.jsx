import NewPasantia from "@/components/pasantias/new";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Publicar Pasantía | JobGet-Lat',
    description: 'Publica tu oportunidad de pasantía y encuentra el mejor talento en JobGet-Lat',
};

export default async function Page() {
    try {
        const headersList = await headers();
        const cookie = await cookies();
        const response = await fetch(process.env.url_front + "/back/api/auth/verificar-token", {
            headers: {
                Cookie: cookie
            },
            cache: 'no-store'
        });

        const userAgent = headersList.get('user-agent') || '';
        const isBot = /bot|googlebot|crawler|spider|crawling/i.test(userAgent);
        if (response.ok||isBot) {
            return <NewPasantia />;
        }
        else {
            return redirect("/user/login");
        }
    } catch (error) {
        console.error('Error al verificar token:', error);
        return redirect("/user/login");
    }
}