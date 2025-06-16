import Register from "@/components/user/register/main";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export default async function Page() {
  const cookie = await cookies();
  const response = await fetch(process.env.url_front + "/back/api/auth/verificar-token", {
    headers: {
      Cookie: cookie
    }
  });
  if (!response.ok) {
    return <Register/>
  }
  else {
    return redirect('/user/perfil');
  }
}