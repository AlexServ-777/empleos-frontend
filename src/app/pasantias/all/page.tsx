
import MostrarPasantias from "@/components/pasantias/all";
import random_int from "@/my_functios/random_int";
import suffle_array from "@/my_functios/suffle_Array";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Pasantías | JobGet-Lat',
    description: 'Encuentra pasantias rapidamente, aqui en JobGet-Lat',
};

export default async function Page(){
    
    const cookie = await cookies();
    const pais = cookie.get('country').value;
    
    const res_count = await fetch(process.env.url_front+`/back/api/pasantias-c/count-pasantias/${pais}?search=`);
    const count_register = await res_count.json();

    const limit = 10;
    const total_pages = Math.ceil(count_register/limit);
    const init_page = random_int(1, total_pages);
    const response = await fetch(process.env.url_front+`/back/api/pasantias-c/search/${pais}?page=${init_page}&limit=${limit}&search=`, {
        //next:{revalidate:600} //10 minutos
    });
    const pasantias= await response.json();
    
    const pages_availables=[];
    for(let i = 1; i<=total_pages;i++){
        if(i!=init_page){
            pages_availables.push(i);
        }
    }
    suffle_array(pages_availables);
    return <MostrarPasantias pasantias={pasantias} pages_availables={pages_availables} limit={limit}/>
}