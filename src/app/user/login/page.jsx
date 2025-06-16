export const dynamic = 'force-dynamic';
import Login from "@/components/user/login/main";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function Page() {
    const cookie = await cookies();
    const response = await fetch(process.env.url_front + "/back/api/auth/verificar-token", {
        headers: {
            Cookie: cookie
        }
    });
    if (response.ok) {
        return redirect("/user/perfil");
    }
    else {
        return <Login/>
    }
}