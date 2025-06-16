import MostrarServicios from "@/components/servicios/all";
export const dynamic = 'force-dynamic';
export default async function Page() {
    try {

        const response = await fetch(process.env.url_front + "/back/api/servicios-c/getPublic/Bolivia");
        const servicios = await response.json();
        return <MostrarServicios servicios={servicios} />
    }
    catch {

        return <MostrarServicios servicios={[]} />
    }
}