import MostrarServicios from "@/components/servicios/all";
import random_int from "@/my_functios/random_int";
import suffle_array from "@/my_functios/suffle_Array";
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Servicios | JobGet-Lat',
    description: 'Descubre los mejores servicios profesionales disponibles en tu país, aqui en JobGet-Lat',
};

export default async function Page() {
    try {
        const cookie = await cookies();
        const pais = cookie.get('country').value;
        
        const res_count = await fetch(process.env.url_front+ `/back/api/servicios-c/count-servicios/${pais}?search=`);
        const total_rows = await res_count.json();

        const limit = 2;
        const total_pages = Math.ceil(total_rows/limit);

        const init_page = random_int(1,total_pages);
        const response = await fetch(process.env.url_front + `/back/api/servicios-c/search/${pais}?page=${init_page}&limit=${limit}&search=`, {
            //next:{revalidate:600} //10 minutos
        });
        const servicios = await response.json();
        const pages_availables = [];
        
        for(let i = 1; i<=total_pages;i++){
            if(i!=init_page){
                pages_availables.push(i);
            }
        }
        suffle_array(pages_availables);
        console.log(pages_availables)
        return <MostrarServicios servicios={servicios} pages_availables={pages_availables} limit={limit} />
    }
    catch {

        return <MostrarServicios servicios={[]} pages_availables={[]} limit={0} />
    }
}