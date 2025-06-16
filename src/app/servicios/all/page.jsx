import MostrarServicios from "@/components/servicios/all";
export const dynamic = 'force-dynamic';
export default async function Page() {
    try {
        const cookie = await cookies();
        const pais = cookie.get('country').value;
        const response = await fetch(process.env.url_front + "/back/api/servicios-c/getPublic/"+pais);
        const servicios = await response.json();
        return <MostrarServicios servicios={servicios} />
    }
    catch {

        return <MostrarServicios servicios={[]} />
    }
}