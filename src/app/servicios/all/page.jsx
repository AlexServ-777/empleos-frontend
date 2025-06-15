import MostrarServicios from "@/components/servicios/all";

export default async function Page() {
    try {

        const response = await fetch(process.env.url_front + "/back/api/servicios-c/getPublic/bolivia");
        const servicios = await response.json();
        return <MostrarServicios servicios={servicios} />
    }
    catch {

        return <MostrarServicios servicios={[]} />
    }
}